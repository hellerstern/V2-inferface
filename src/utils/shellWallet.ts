/* eslint-disable @typescript-eslint/restrict-plus-operands */
import Wallet from 'ethereumjs-wallet';
import { ethers } from 'ethers';
import Cookies from 'universal-cookie';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const encryptpwd = require('encrypt-with-password');

declare let window: any;
const { ethereum } = window;

let currentAddress: any = '';
let shell_private = '';

const cookies = new Cookies();

export const generateShellWallet = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();

  const wallet = Wallet.generate();
  const privateKey = wallet.getPrivateKeyString();
  const address = wallet.getAddressString();

  const signature = (
    await signer.signMessage('Sign this message to unlock shell wallet.\nShell Wallet: ' + address)
  ).toString();
  cookies.set(signerAddress + '_k', signature, { sameSite: 'strict', expires: new Date(Date.now() + 86400000) });
  const e_privateKey = encryptpwd.encrypt(privateKey, signature);

  localStorage.setItem(signerAddress + '_public_key', address);
  localStorage.setItem(signerAddress + '_e_private_key', e_privateKey);

  currentAddress = address;
  shell_private = privateKey;
};

export const unlockShellWallet = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();
  if (signerAddress.length === 0 || signerAddress === '') {
    return;
  }

  console.log(signerAddress);

  if (
    localStorage.getItem(signerAddress + '_public_key') === undefined ||
    localStorage.getItem(signerAddress + '_e_private_key') === undefined
  ) {
    await generateShellWallet();
  } else {
    const e_privateKey = localStorage.getItem(signerAddress + '_e_private_key');
    currentAddress = localStorage.getItem(signerAddress + '_public_key');

    let signature = cookies.get(signerAddress + '_k');
    if (!signature || signature === '') {
      signature = (
        await signer.signMessage('Sign this message to unlock shell wallet.\nShell Wallet: ' + currentAddress)
      ).toString();
      cookies.set(signerAddress + '_k', signature, { sameSite: 'strict', expires: new Date(Date.now() + 86400000) });
    }
    shell_private = encryptpwd.decrypt(e_privateKey, signature);
  }
};

export const getShellAddress = async () => {
  if (!currentAddress) return '';
  // await unlockShellWallet();

  return currentAddress;
};

export const getShellBalance = async () => {
  if (!currentAddress) return '0';

  const provider = new ethers.providers.Web3Provider(ethereum);
  const balance = await provider.getBalance(currentAddress);

  return ethers.utils.formatEther(balance);
};

export const getShellNonce = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  return await provider.getTransactionCount(currentAddress, 'pending');
};

export const getShellWallet = async () => {
  if (!shell_private || shell_private === '') {
    await unlockShellWallet();
  }

  const provider = new ethers.providers.Web3Provider(ethereum);
  const wallet = new ethers.Wallet(shell_private, provider);

  return wallet;
};

export const sendGasBack = async (wallet: any) => {
  const _wallet = await getShellWallet();
  const gasPriceEstimate = await _wallet.getGasPrice();
  const balance = ethers.utils.parseEther(await getShellBalance());
  const gasLimitEstimate = await _wallet.estimateGas({
    to: wallet,
    data: '0x00000000',
    value: 0
  });
  const _value = (
    parseInt(balance.toString()) -
    parseInt(gasPriceEstimate.toString()) * parseInt(gasLimitEstimate.toString())
  ).toString();
  await _wallet.sendTransaction({
    to: wallet,
    value: _value,
    gasPrice: gasPriceEstimate,
    nonce: await getShellNonce()
  });
};
