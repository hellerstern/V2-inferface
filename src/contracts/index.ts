let signer: any;
let provider: any;

export const initializeWeb3 = async (provider_: any, signer_: any) => {
    provider = provider_;
    signer = signer_;
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