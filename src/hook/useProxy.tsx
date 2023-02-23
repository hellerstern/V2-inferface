import { ethers } from "ethers";
import { usePrepareContractWrite, useContractWrite, useContractRead, useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import { getNetwork } from "src/constants/networks";
import { toast } from 'react-toastify';
import { getShellAddress } from "src/shell_wallet";

export const useApproveProxy = (setIsProxyApproved: any) => {
    const { chain } = useNetwork();
    const { abis, proxyGas, addresses } = getNetwork(chain?.id);
    const { config } = usePrepareContractWrite({
        address: addresses.trading,
        abi: abis.trading,
        functionName: 'approveProxy',
        args: [getShellAddress() as `0x${string}`, Math.floor(Date.now() / 1000) + 31536000],
        overrides: {
            value: ethers.utils.parseEther(proxyGas)
        }
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