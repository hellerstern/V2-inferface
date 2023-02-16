import { POSITIONS_ABI, TRADING_ABI, ERC20_ABI, PAIR_ABI, VAULT_ABI, NFT_SALE, GOV_NFT, TRADINGLIBRARY_ABI, STAKING_ABI, REF_ABI } from "../../abis"
import { tigusdLogo, daiLogo, usdtLogo } from '../../../config/images';

function isClosed(asset:any) {
    if(asset === 2 || asset === 32 || asset === 5 || asset === 6 || asset === 7 || asset === 8 || asset === 10) {
		const d = new Date();
		const day = d.getUTCDay();
		const hour = d.getUTCHours();
	
		if(day === 0 && hour < 21) {
			return true;
		} else if (day === 6) {
			return true;
		} else if (day === 5 && hour > 20) {
			return true;
		}
	} else return false;
}

export const NETWORK = {
    network_id: 421613,
    name: "Arbitrum Görli",
    rpc: "https://goerli-rollup.arbitrum.io/rpc/",
    layerzero: 0,
    addresses: {
        positions: "0xca8DEDA5F2f358fE22e6631FfAa1FCA89dbd8a87",
        trading: "0x73e6773c481fd55DBb776eDFABbA1D6e057FF360",
        tradinglibrary: "0x4e7C137CA43b2003a84481F32354684d386F6F63",
        tigusd: "0xfE7080BcD5E19cCE206Da4FE8D29816CeAff4a32",
        tigusdvault: "0x183414B0AE96Bf27558bE26E0F8B810BA854517D",
        pairscontract: "0x8B2DF26893ce180b961FDe89B7d246c8A3756cFc",
        treasury: "0x1727FC1d930912FA075ff82741d9f50362350589",
        govnft: "0x231EeD5a0ceD421672ca6E578C0c1790eb736b29",
        referrals: "0x156336d00b6f365FB8522886BCD74f3c015B50f5",
        nftsale: "0xd1bF71b53E32C089A26C3bFD880d9DdF08425636"
    },
    abis: {
        positions: POSITIONS_ABI,
        trading: TRADING_ABI,
        tradinglibrary: TRADINGLIBRARY_ABI,
        erc20: ERC20_ABI,
        pairscontract: PAIR_ABI,
        tigusdvault: VAULT_ABI,
        nftsale: NFT_SALE,
        govnft: GOV_NFT,
        staking: STAKING_ABI,
        referrals: REF_ABI
    },
    icon: "assets/images/arbtest.png",
    gasLimit: 10_000_000,
    proxyGas: "0.01",
    minProxyGas: 0.002,
    assets: [],
    marginAssets: [
        {
            name: "tigUSD",
            address: "0xfE7080BcD5E19cCE206Da4FE8D29816CeAff4a32",
            stablevault: "0x183414B0AE96Bf27558bE26E0F8B810BA854517D",
            decimals: 18,
            hasPermit: true,
            icon: tigusdLogo
        },
        {
            name: "DAI",
            address: "0xE94Aa6479601544a32e43CAF082A2F7FC7fB0720",
            stablevault: "0x183414B0AE96Bf27558bE26E0F8B810BA854517D",
            decimals: 18,
            hasPermit: true,
            icon: daiLogo
        },
        {
            name: "USDT",
            address: "0xfb59C8Cac513440cD93306987BcfC53202940868",
            stablevault: "0x183414B0AE96Bf27558bE26E0F8B810BA854517D",
            decimals: 6,
            hasPermit: true,
            icon: usdtLogo
        }
    ],
    nativeSupported: false
}