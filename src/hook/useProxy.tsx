import { ethers } from "ethers";
import { usePrepareContractWrite, useContractWrite, useContractRead, useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import { getNetwork } from "src/constants/networks";
import { toast } from 'react-toastify';

export const useApproveProxy = (setIsProxyApproved: any, proxyAddress: string, time: number) => {
    const { chain } = useNetwork();
    const { abis, proxyGas, addresses } = getNetwork(chain?.id);
    
    const { config } = usePrepareContractWrite({
        address: addresses.trading,
        abi: abis.trading,
        functionName: 'approveProxy',
        args: [proxyAddress as `0x${string}`, time],
        overrides: {
            value: ethers.utils.parseEther(proxyGas)
        },
        cacheTime: 10000
    });
    const { write, data } = useContractWrite({
        ...config,
        onError() {
            toast.dismiss();
            toast.error("Proxy approval failed!");
        }
    });
    useWaitForTransaction({
        hash: data?.hash,
        onError() {
            toast.dismiss();
            toast.error("Proxy approval failed!");
        },
        onSuccess() {
            setIsProxyApproved(true);
            toast.dismiss();
            toast.success("Successfully approved proxy!");
        }
    });
    return [write];
}

export const useProxyApproval = () => {
    const { chain } = useNetwork();
    const { address } = useAccount();
    const { abis, addresses } = getNetwork(chain?.id);
    const { data } = useContractRead({
        address: addresses.trading,
        abi: abis.trading,
        functionName: 'proxyApprovals',
        args: [address as `0x${string}`],
        watch: true
    });

    return data
}