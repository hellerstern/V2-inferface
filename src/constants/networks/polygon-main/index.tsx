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
  assets: [
    {
      name: 'BTC/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(0),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 2,
      spread: 0
    },
    {
      name: 'ETH/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(1),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 2,
      spread: 0
    },
    {
      name: 'XAU/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(2),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 2,
      spread: 0
    },
    {
      name: 'MATIC/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(3),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 4,
      spread: 0
    },
    {
      name: 'LINK/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(4),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 3,
      spread: 0
    },
    {
      name: 'EUR/USD',
      minPosition: 500,
      minLev: 4,
      maxLev: 500,
      fee: 0.0002,
      isClosed: isClosed(5),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 5,
      spread: 0
    },
    {
      name: 'GBP/USD',
      minPosition: 500,
      minLev: 4,
      maxLev: 500,
      fee: 0.0002,
      isClosed: isClosed(6),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 5,
      spread: 0
    },
    {
      name: 'JPY/USD',
      minPosition: 500,
      minLev: 4,
      maxLev: 500,
      fee: 0.0002,
      isClosed: isClosed(7),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 6,
      spread: 0
    },
    {
      name: 'RUB/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 10,
      fee: 0.01,
      isClosed: isClosed(8),
      defaultLev: 10,
      defaultMargin: 50,
      decimals: 5,
      spread: 0
    },
    {
      name: 'CHF/USD',
      minPosition: 500,
      minLev: 4,
      maxLev: 500,
      fee: 0.0002,
      isClosed: isClosed(9),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 5,
      spread: 0
    },
    {
      name: 'CAD/USD',
      minPosition: 500,
      minLev: 4,
      maxLev: 500,
      fee: 0.0002,
      isClosed: isClosed(10),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 5,
      spread: 0
    },
    {
      name: 'ETH/BTC',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(11),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 6,
      spread: 0
    },
    {
      name: 'XRP/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(12),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 5,
      spread: 0
    },
    {
      name: 'BNB/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(13),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 3,
      spread: 0
    },
    {
      name: 'ADA/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(14),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 5,
      spread: 0
    },
    {
      name: 'ATOM/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(15),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 4,
      spread: 0
    },
    {
      name: 'HBAR/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(16),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 6,
      spread: 0
    },
    {
      name: 'TRX/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(17),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 6,
      spread: 0
    },
    {
      name: 'SOL/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(18),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 4,
      spread: 0
    },
    {
      name: 'DOGE/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(19),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 7,
      spread: 0.0005
    },
    {
      name: 'LTC/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(20),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 4,
      spread: 0
    },
    {
      name: 'BCH/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(21),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 3,
      spread: 0
    },
    {
      name: 'ETC/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(22),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 3,
      spread: 0
    },
    {
      name: 'DOT/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(23),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 5,
      spread: 0
    },
    {
      name: 'XMR/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(24),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 3,
      spread: 0
    },
    {
      name: 'SHIB/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(25),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 9,
      spread: 0
    },
    {
      name: 'AVAX/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(26),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 4,
      spread: 0
    },
    {
      name: 'UNI/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(27),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 4,
      spread: 0
    },
    {
      name: 'XLM/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(28),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 7,
      spread: 0
    },
    {
      name: 'NEAR/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(29),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 4,
      spread: 0
    },
    {
      name: 'ALGO/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(30),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 5,
      spread: 0
    },
    {
      name: 'ICP/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(31),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 3,
      spread: 0
    },
    {
      name: 'XAG/USD',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(32),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 4,
      spread: 0
    },
    {
      name: 'LINK/BTC',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(33),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 7,
      spread: 0
    },
    {
      name: 'XMR/BTC',
      minPosition: 500,
      minLev: 2,
      maxLev: 100,
      fee: 0.001,
      isClosed: isClosed(34),
      defaultLev: 100,
      defaultMargin: 5,
      decimals: 6,
      spread: 0
    }
  ],
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
