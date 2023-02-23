import { Provider } from "@wagmi/core";
import { Signer } from "ethers";

let signer: Signer;
let provider: Provider;
let address: string | undefined;

export const initializeWeb3 = async (provider_: any, signer_: any, address_: string | undefined) => {
    provider = provider_;
    signer = signer_;
    address = address_
    return true;
};

export const getSigner = () => {
    if(signer !== null && signer !== undefined) {
        return signer;
    }
}

export const getProvider = () => {
    if(provider !== null && provider !== undefined) {
        return provider;
    }
}

export const getAddress = () => {
    if(signer !== null && signer !== undefined) {
        return address;
    }
}