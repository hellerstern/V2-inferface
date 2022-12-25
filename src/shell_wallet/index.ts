// import { ethers } from 'ethers';
// import Cookies from 'universal-cookie';
// import crypto from "crypto";
// const IV = "5183666c72eec9e4";
// const ALGO = "aes-256-cbc";

// const encrypt = (text: string, sig: string) => {
//     const cipher = crypto.createCipheriv(ALGO, sig, IV);
//     let encrypted = cipher.update(text, "utf8", "base64");
//     encrypted += cipher.final("base64");
//     return encrypted;
// };

// const decrypt = (text: string, sig: string) => {
//     const decipher = crypto.createDecipheriv(ALGO, sig, IV);
//     const decrypted = decipher.update(text, "base64", "utf8");
//     return decrypted + decipher.final("utf8");
// };

// declare const window: any
// const { ethereum } = window;

// let currentAddress = "";
// let shell_private = "";

// const cookies = new Cookies();

// export const generateShellWallet = async () => {
//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const signer = provider.getSigner();
//     const signerAddress = await signer.getAddress();

//     const wallet = ethers.Wallet.createRandom();
//     const privateKey = wallet.privateKey;
//     const address = wallet.address;

//     const signature = (await signer.signMessage("Sign this message to unlock shell wallet.\nShell Wallet: " + address)).toString();
//     cookies.set(signerAddress + "_k", signature, { sameSite: "strict", expires: new Date(Date.now() + 86400000) });
//     const e_privateKey = encrypt(privateKey, signature);

//     localStorage.setItem(signerAddress + '_public_key', address);
//     localStorage.setItem(signerAddress + '_e_private_key', e_privateKey);

//     currentAddress = address;
//     shell_private = privateKey;
// }

// export const unlockShellWallet = async () => {
//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const signer = provider.getSigner();
//     const signerAddress = await signer.getAddress();
//     if (!signerAddress || signerAddress === "") {
//         return;
//     }

//     console.log(signerAddress);

//     if (localStorage.getItem(signerAddress + '_public_key') === undefined || localStorage.getItem(signerAddress + '_e_private_key') === undefined) {
//         await generateShellWallet();
//     } else {
//         const e_privateKey = localStorage.getItem(signerAddress + '_e_private_key');
//         if (e_privateKey === null) return;
//         const _currentAddress = localStorage.getItem(signerAddress + '_public_key');
//         if (_currentAddress !== null) currentAddress = _currentAddress;

//         let signature = cookies.get(signerAddress + "_k");
//         if (!signature || signature === "") {
//             signature = await signer.signMessage("Sign this message to unlock shell wallet.\nShell Wallet: " + currentAddress);
//             cookies.set(signerAddress + "_k", signature, { sameSite: "strict", expires: new Date(Date.now() + 86400000) });
//         }
//         shell_private = decrypt(e_privateKey, signature);
//     }
// }

// export const getShellAddress = async () => {
//     if (!currentAddress) return ""; // await unlockShellWallet();

//     return currentAddress;
// }

// export const getShellBalance = async () => {
//     if (!currentAddress) return "0";

//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const balance = await provider.getBalance(currentAddress);

//     return ethers.utils.formatEther(balance);
// }

// export const getShellNonce = async () => {
//     const provider = new ethers.providers.Web3Provider(ethereum);
//     return await provider.getTransactionCount(currentAddress, "pending");
// }

// export const getShellWallet = async () => {
//     if (!shell_private || shell_private === "") {
//         await unlockShellWallet();
//     }

//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const wallet = new ethers.Wallet(shell_private, provider);

//     return wallet;
// }

// export const sendGasBack = async (wallet: any) => {
//     const _wallet = await getShellWallet();
//     const gasPriceEstimate = await _wallet.getGasPrice();
//     const balance = ethers.utils.parseEther(await getShellBalance());
//     const gasLimitEstimate = await _wallet.estimateGas({
//         to: wallet,
//         data: '0x00000000',
//         value: 0
//     });
//     const _value = (parseInt(balance.toString()) - parseInt(gasPriceEstimate.toString()) * parseInt(gasLimitEstimate.toString()) * 2).toString();
//     await _wallet.sendTransaction({
//         to: wallet,
//         value: _value,
//         gasPrice: gasPriceEstimate,
//         nonce: await getShellNonce()
//     });
// }

export {}