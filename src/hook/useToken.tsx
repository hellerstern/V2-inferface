import { ethers } from "ethers";
import { erc20ABI, usePrepareContractWrite, useContractWrite, useContractRead, useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import { getNetwork } from "src/constants/networks";

export const useTokenAllowance = (tokenAddress: string) => {
    const { address } = useAccount()
    const { chain } = useNetwork()
    const network = getNetwork(chain?.id)
    if (!address) return 0;

    const { data, isError, isFetching } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address, network.addresses.trading as `0x${string}`],
        watch: true
    })

    return data
}

export const useTokenBalance = (tokenAddress: string) => {
    const { address } = useAccount()
    if (!address) return 0;

    const { data, isError, isFetching } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [address],
        watch: true
    })

    return data
}
