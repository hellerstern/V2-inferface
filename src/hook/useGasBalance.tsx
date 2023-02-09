import { useBalance } from "wagmi";

export const useGasBalance = (address: string) => {
    const { data } = useBalance({
        address: address as `0x${string}`,
        watch: true
    });
    return data;
}