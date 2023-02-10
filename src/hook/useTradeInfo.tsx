import { useContractRead, useAccount, useNetwork } from "wagmi";
import { getNetwork } from "src/constants/networks";
const { abis } = getNetwork(0);

export const useOpenInterest = (pairIndex: number) => {
    const { chain } = useNetwork();
    const { addresses } = getNetwork(chain?.id);
    const { data } = useContractRead({
        address: addresses.pairscontract,
        abi: abis.pairscontract,
        functionName: 'idToOi',
        args: [pairIndex, addresses.tigusd],
        watch: true
    });
    return data;
}

export const usePairData = (pairIndex: number) => {
    const { chain } = useNetwork();
    const { addresses } = getNetwork(chain?.id);
    const { data } = useContractRead({
        address: addresses.pairscontract,
        abi: abis.pairscontract,
        functionName: 'idToAsset',
        args: [pairIndex],
        watch: true
    });
    return data;
}

export const useOpenFees = () => {
    const { chain } = useNetwork();
    const { addresses } = getNetwork(chain?.id);
    const { data } = useContractRead({
        address: addresses.trading,
        abi: abis.trading,
        functionName: 'openFees',
        args: [],
        watch: true
    });
    return data;
}

export const useCloseFees = () => {
    const { chain } = useNetwork();
    const { addresses } = getNetwork(chain?.id);
    const { data } = useContractRead({
        address: addresses.trading,
        abi: abis.trading,
        functionName: 'closeFees',
        args: [],
        watch: true
    });
    return data;
}

export const useVaultFunding = () => {
    const { chain } = useNetwork();
    const { addresses } = getNetwork(chain?.id);
    const { data } = useContractRead({
        address: addresses.trading,
        abi: abis.trading,
        functionName: 'vaultFundingPercent',
        args: [],
        watch: true
    });
    return data;
}

export const useReferral = () => {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { addresses } = getNetwork(chain?.id);
    const { data } = useContractRead({
        address: addresses.referrals,
        abi: abis.referrals,
        functionName: 'getReferred',
        args: [address],
        watch: true
    });
    return data;
}