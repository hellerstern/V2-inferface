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

import { tigusdLogo, usdtLogo, ArbiScanSvg } from '../../../config/images';

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
  network_id: 42161,
  name: 'Arbitrum',
  rpc: 'https://arb1.arbitrum.io/rpc',
  layerzero: 110,
  addresses: {
    positions: '0xb75bF135a05665855377a689D39203750CbA6C30',
    trading: '0x6c5Da3f6A1f1B41feE2aA4a86b935272663b4957',
    tradinglibrary: '0x8471534035EA368Dd0c84348eA4166a42bA6567e',
    tigusd: '0x7E491F53bF807f836E2dd6C4A4FBd193e1913EFd',
    tigusdvault: '0xe82fcefbDD034500B5862B4827CAE5c117f6b921',
    pairscontract: '0x0e6E91221C46904563fAfDCc814fbF342BE8Ba20',
    nftsale: '0x8Ad92Ba1B0F3d208Bbd9e4882fC9a07c00F81f42',
    treasury: '0xF416C2b41Fb6c592c9BA7cB6B2f985ed593A51d7',
    govnft: '0x303c470c0e0342a1CCDd70b0a17a14b599FF1474',
    staking: '0x5EbA69d5572F583b631E0E4F5608E167467c4BB3',
    referrals: '0x0A869AF0d5162bF70f9c66f10Cba1795221E4F76'
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
  icon: ArbiScanSvg,
  gasLimit: 6_000_000,
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      spread: 0.0005
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
      address: '0x7E491F53bF807f836E2dd6C4A4FBd193e1913EFd',
      stablevault: '0xe82fcefbDD034500B5862B4827CAE5c117f6b921',
      decimals: 18,
      hasPermit: true,
      icon: tigusdLogo
    },
    {
      name: 'USDT',
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      stablevault: '0xe82fcefbDD034500B5862B4827CAE5c117f6b921',
      decimals: 6,
      hasPermit: true,
      icon: usdtLogo
    }
  ],
  nativeSupported: false
};
