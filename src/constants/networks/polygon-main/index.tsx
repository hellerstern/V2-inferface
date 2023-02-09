/* eslint-disable */
import {
  POSITIONS_ABI,
  TRADING_ABI,
  ERC20_ABI,
  PAIR_ABI,
  VAULT_ABI,
  NFT_SALE,
  GOV_NFT,
  TRADINGLIBRARY_ABI,
  STAKING_ABI,
  REF_ABI
} from '../../abis';

import { tigusdLogo, daiLogo, PolygonSvg } from '../../../config/images';

function isClosed(asset: any) {
  if (asset == 2 || asset == 32 || asset == 5 || asset == 6 || asset == 7 || asset == 8 || asset == 10) {
    const d = new Date();
    let day = d.getUTCDay();
    let hour = d.getUTCHours();
    let minute = d.getUTCMinutes();

    if (day == 0 && hour < 21) {
      return true;
    } else if (day == 6) {
      return true;
    } else if (day == 5 && hour > 20) {
      return true;
    }
  } else return false;
}

export const NETWORK = {
  network_id: 137,
  name: 'Polygon',
  rpc: 'https://polygon-rpc.com',
  layerzero: 109,
  addresses: {
    positions: '0xBB323fE012BFA1728AF14941D09E479612b64281',
    trading: '0x28c5d4416f6cf0FC5F557067b54BD67a43fcC98F',
    tradinglibrary: '0x4eeEf5073d7602fad64F93762BbC1fdDA725C404',
    tigusd: '0x76973Ba2AFF24F87fFE41FDBfD15308dEBB8f7E8',
    tigusdvault: '0x3677415Dc23e49B7780ef46976F418F4a9d5031B',
    pairscontract: '0x64c96eE480ab084D01dC682DB0197a68C664D724',
    nftsale: '0x1727FC1d930912FA075ff82741d9f50362350589',
    treasury: '0x4f7046f36B5D5282A94cB448eAdB3cdf9Ff2b051',
    govnft: '0x5DF98AA475D8815df7cd4fC4549B5c150e8505Be',
    staking: '0x5EbA69d5572F583b631E0E4F5608E167467c4BB3',
    referrals: '0xfE4AF289b1a3fA6ac8902031eAD94ff4D57D01f8'
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
  icon: PolygonSvg,
  gasLimit: 2_000_000,
  proxyGas: "1",
  minProxyGas: 0.2,
  assets: [],
  marginAssets: [
    {
      name: 'tigUSD',
      address: '0x76973Ba2AFF24F87fFE41FDBfD15308dEBB8f7E8',
      stablevault: '0x3677415Dc23e49B7780ef46976F418F4a9d5031B',
      decimals: 18,
      hasPermit: true,
      icon: tigusdLogo
    },
    {
      name: 'DAI',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      stablevault: '0x3677415Dc23e49B7780ef46976F418F4a9d5031B',
      decimals: 18,
      hasPermit: false,
      icon: daiLogo
    }
  ],
  nativeSupported: false
};
