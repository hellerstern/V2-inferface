import Wallet from "ethereumjs-wallet";
import { ethers } from 'ethers';
import Cookies from 'universal-cookie';
import { useAccount } from "wagmi";
// eslint-disable-next-line
const encryptpwd = require('encrypt-with-password');

declare const window: any
const { ethereum } = window;

let currentAddress = "";
let shell_private = "";

const cookies = new Cookies();

let isGenerating = false;
export const generateShellWallet = async () => {
    if (isGenerating) {
        console.log("Shell gen in process");
        return;
    }
    isGenerating = true;
    const provider = new ethers.providers.JsonRpcProvider(ethereum);
    if(provider === undefined) return;
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();

    const wallet = Wallet.generate();
    const privateKey = wallet.getPrivateKeyString();
    const address = wallet.getAddressString();

    let signature;
    try {
        signature = (await signer.signMessage("Sign this message to unlock shell wallet.\nShell Wallet: " + address)).toString();
    } catch (err) {
        console.log(err);
        isGenerating = false;
        return;
    }
    isGenerating = false;

    cookies.set(signerAddress + "_k", signature, { sameSite: "strict" });
    const e_privateKey = encryptpwd.encrypt(privateKey, signature);

    localStorage.setItem(signerAddress + '_public_key', address);
    localStorage.setItem(signerAddress + '_e_private_key', e_privateKey);

    currentAddress = address;
    shell_private = privateKey;
}

export const checkShellWallet = async (address: string) => {
    if (localStorage.getItem(address + '_public_key') && localStorage.getItem(address + '_e_private_key')) {
        const e_privateKey = localStorage.getItem(address + '_e_private_key');
        const _currentAddress = localStorage.getItem(address + '_public_key');
        const signature = cookies.get(address + "_k");
        if (signature) {
            currentAddress = _currentAddress as string;
            shell_private = encryptpwd.decrypt(e_privateKey, signature);
        }
    } else {
        currentAddress = "";
        shell_private = "";
    }
}

export const unlockShellWallet = async () => {
    const provider = ethereum ? new ethers.providers.JsonRpcProvider(ethereum) : null;
    if (provider === null) return;
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    if (!signerAddress || signerAddress === "") {
        return;
    }

    if (localStorage.getItem(signerAddress + '_public_key') === null || localStorage.getItem(signerAddress + '_e_private_key') === null) {
        await generateShellWallet();
    } else {
        const e_privateKey = localStorage.getItem(signerAddress + '_e_private_key');
        const _currentAddress = localStorage.getItem(signerAddress + '_public_key');
        if (_currentAddress === null) {
            return;
        }
        currentAddress = _currentAddress;

        let signature = cookies.get(signerAddress + "_k");
        if (!signature || signature === "") {
            if (isGenerating) return;
            isGenerating = true;
            try {
                signature = (await signer.signMessage("Sign this message to unlock shell wallet.\nShell Wallet: " + currentAddress)).toString();
            } catch (err) {
                console.log(err);
                isGenerating = false;
                return;
            }
            isGenerating = false;
            cookies.set(signerAddress + "_k", signature, { sameSite: "strict" });
        }
        shell_private = encryptpwd.decrypt(e_privateKey, signature);
    }
}

export const getShellAddress = () => {
    return currentAddress;
}

export const getShellBalance = async () => {
    if (!currentAddress) return "0";

    const provider = ethereum ? new ethers.providers.JsonRpcProvider(ethereum) : ethers.providers.getDefaultProvider();
    const balance = await provider.getBalance(currentAddress);

    return ethers.utils.formatEther(balance);
}

export const getShellNonce = async () => {
    const provider = ethereum ? new ethers.providers.JsonRpcProvider(ethereum) : ethers.providers.getDefaultProvider();
    return await provider.getTransactionCount(currentAddress, "pending");
}

export const getShellWallet = async () => {
    if (!shell_private || shell_private === "") {
        await unlockShellWallet();
    }

    const provider = ethereum ? new ethers.providers.JsonRpcProvider(ethereum) : ethers.providers.getDefaultProvider();
    const wallet = new ethers.Wallet(shell_private, provider);

    return wallet;
}

export const sendGasBack = async (wallet: any) => {
    const _wallet = await getShellWallet();
    const gasPriceEstimate = await _wallet.getGasPrice();
    const balance = ethers.utils.parseEther(await getShellBalance());
    const gasLimitEstimate = await _wallet.estimateGas({
        to: wallet,
        data: '0x00000000',
        value: 0
    });
    const _value = (parseInt(balance.toString()) - parseInt(gasPriceEstimate.toString()) * parseInt(gasLimitEstimate.toString()) * 2).toString();
    await _wallet.sendTransaction({
        to: wallet,
        value: _value,
        gasPrice: gasPriceEstimate,
        nonce: await getShellNonce()
    });
}