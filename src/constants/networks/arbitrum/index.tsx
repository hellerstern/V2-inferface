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
  proxyGas: "0.01",
  assets: [],
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
