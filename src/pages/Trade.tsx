import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from '../../src/components/Container';
import { TokenDetails } from '../../src/components/TokenDetails';
import TradingChart from '../../src/components/TradingChart/TradingChart';
import { TradingOrderForm } from '../../src/components/TradingOrderForm';
import { TradingPositionTable } from '../../src/components/TradingPositionTable';
import { DailyPerformanceChart } from '../../src/components/DailyChart';
import { Chatbox } from '../../src/components/Chatbox';
import { useStore } from '../../src/context/StoreContext';
import { Cumulative } from './MiniPage/Cumulative';
import { PositionData } from 'src/components/Table/PositionData';
import { TraderProfile } from 'src/context/profile';
import { PairSelectionTable } from 'src/components/PairSelectionTable';
import { useAccount, useNetwork } from 'wagmi';
import { ethers } from 'ethers';
import { getNetwork } from 'src/constants/networks';
import socketio from "socket.io-client";

declare const window: any
const { ethereum } = window;

export const Trade = () => {
  const positionData = PositionData().positionData;

  const [pairIndex, setPairIndex] = useState(
    localStorage.getItem('LastPairSelected') !== null ? parseInt(localStorage.getItem('LastPairSelected') as string) : 0
  );
  const { miniPage } = useStore();

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    if (localStorage.getItem('FavPairs') === null) localStorage.setItem('FavPairs', '["BTC/USD", "ETH/USD"]');
  }, []);

  useEffect(() => {
    getTokenDetails();
  }, [address, chain, pairIndex]);

  useEffect(() => {
    TraderProfile();
  }, [address, chain]);

  const [maxOi, setMaxOi] = useState(1000000e18);
  const [minLev, setMinLev] = useState(1);
  const [maxLev, setMaxLev] = useState(100);
  const [openFee, setOpenFee] = useState("0.10%");
  const [closeFee, setCloseFee] = useState("0.10%");
  const [longOi, setLongOi] = useState(0);
  const [shortOi, setShortOi] = useState(0);
  const [shortAPRHourly, setShortAPRHourly] = useState(0);
  const [longAPRHourly, setLongAPRHourly] = useState(0);

  useEffect(() => {
    if (address !== undefined) {
      const eventSocket = socketio('https://trading-events-zcxv7.ondigitalocean.app/', { transports: ['websocket'] });

      eventSocket.on('error', (error: any) => {
        console.log('Trading Events Socket Error:', error);
      });

      eventSocket.on('PositionOpened', (data: any) => {
        if (data.chainId === chain?.id) {
          if (data.orderType === 0) {
            setTimeout(() => {
              getTokenDetails();
            }, 2000);
          }
        }
      });

      eventSocket.on('PositionLiquidated', (data: any) => {
        if ( data.chainId === chain?.id) {
          setTimeout(() => {
            getTokenDetails();
          }, 2000);
        }
      });

      eventSocket.on('PositionClosed', (data: any) => {
        if (data.chainId === chain?.id) {
          setTimeout(() => {
            getTokenDetails();
          }, 2000);
        }
      });

      eventSocket.on('LimitOrderExecuted', (data: any) => {
        if (data.chainId === chain?.id) {
          setTimeout(() => {
            getTokenDetails();
          }, 2000);
        }
      });

      eventSocket.on('AddToPosition', (data: any) => {
        if (data.chainId === chain?.id) {
          setTimeout(() => {
            getTokenDetails();
          }, 2000);
        }
      });

      return () => {
        eventSocket.disconnect();
      }
    }
  }, [address, chain, pairIndex]);

  async function getTokenDetails() {
    if (!isConnected) return;
    const currentNetwork = getNetwork(chain?.id);
    const provider = new ethers.providers.Web3Provider(ethereum);
    const pairContract = new ethers.Contract(currentNetwork.addresses.pairscontract, currentNetwork.abis.pairscontract, provider);
    const tradingContract = new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, provider);
    const referrals = new ethers.Contract(currentNetwork.addresses.referrals, currentNetwork.abis.referrals, provider);

    const [pair, oi, vaultFunding, openFees, closeFees, ref] = await Promise.all([
      pairContract.idToAsset(pairIndex),
      pairContract.idToOi(pairIndex, currentNetwork.addresses.tigusd),
      tradingContract.vaultFundingPercent(),
      tradingContract.openFees(),
      tradingContract.closeFees(),
      referrals.getReferred(address)
    ]);

    const isReferred = ref === ethers.constants.HashZero;
    const oFees = ((openFees.daoFees/1 + openFees.burnFees/1 - (isReferred ? openFees.referralFees/1e10 : 0))*pair.feeMultiplier/1e10)/1e8;
    const cFees = ((closeFees.daoFees/1 + closeFees.burnFees/1 - (isReferred ? closeFees.referralFees/1e10 : 0))*pair.feeMultiplier/1e10)/1e8;
    setOpenFee(oFees.toFixed(2) + "%");
    setCloseFee(cFees.toFixed(2) + "%");

    const minLev = pair.minLeverage/1e18;
    const maxLev = pair.maxLeverage/1e18;
    setMinLev(minLev);
    setMaxLev(maxLev);

    const longOI = oi.longOi;
    const shortOI = oi.shortOi;
    const maxOI = oi.maxOi;

    setLongOi(longOI);
    setShortOi(shortOI);
    setMaxOi(maxOI);

    const diff = longOI > shortOI ? longOI - shortOI : shortOI - longOI;

    const baseFundingRate = pair.baseFundingRate;
    const base = diff * baseFundingRate;

    let shortAPR = base/shortOI;
    let longAPR = base/longOI;

    if(longOI > shortOI) shortAPR = shortAPR * -1;
    else longAPR = longAPR * -1;

    let shortAPRHourly = shortAPR/365/24/1e8;
    let longAPRHourly = longAPR/365/24/1e8;

    if (longOI < shortOI) {
      longAPRHourly = longAPRHourly*(1e10-vaultFunding)/1e10;
    } else if (shortOI < longOI) {
      shortAPRHourly = shortAPRHourly*(1e10-vaultFunding)/1e10;
    }

    if(longOI === 0 && shortOI === 0) {
      setShortAPRHourly(0);
      setLongAPRHourly(0);
    } else {
      setShortAPRHourly(shortAPRHourly);
      setLongAPRHourly(longAPRHourly);
    }
  }

  return (
    <TradeContainer>
      {miniPage === 0 && (
        <>
          <Chatbox />
          <TokenDetails
            pairIndex={pairIndex}
            setPairIndex={setPairIndex}
            maxOi={maxOi}
            longOi={longOi}
            shortOi={shortOi}
            openFee={openFee}
            closeFee={closeFee}
            longAPRHourly={longAPRHourly}
            shortAPRHourly={shortAPRHourly}
            maxLev={maxLev}
          />
          <Container>
            <TradingForm>
              <TradingSection>
                <TradingChart asset={pairIndex} positionData={positionData} />
              </TradingSection>
              <OrderFormContainer>
                <TradingOrderForm pairIndex={pairIndex} longOi={longOi} shortOi={shortOi} maxOi={maxOi}/>
              </OrderFormContainer>
              <PairTableContainer>
                <PairSelectionTable isMobile={false} setPairIndex={setPairIndex}/>
              </PairTableContainer>
            </TradingForm>
            {
              isConnected && 
              <>
                <TradingPositionTable setPairIndex={setPairIndex} positionData={positionData} />
                <DailyPerformanceChart />
              </>
            }
          </Container>
        </>
      )}
      {miniPage === 1 && <Cumulative />}
    </TradeContainer>
  );
};

const TradeContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'hidden',
  marginBottom: '30px'
});

const TradingForm = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '5px',
  display: 'grid',
  gridTemplateColumns: '3fr 0fr',
  marginBottom: '5px',
  gap: '5px',
  [theme.breakpoints.down('desktop')]: {
    gridTemplateColumns: '2fr 2fr'
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: '0px'
  }
}));

const TradingSection = styled(Box)(({ theme }) => ({
  // backgroundColor: 'gray',
  width: '100%',
  [theme.breakpoints.down('desktop')]: {
    gridColumn: '1 / 3',
    order: 1
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: '5px'
  }
}));

const OrderFormContainer = styled(Box)(({ theme }) => ({
  width: '400px',
  // maxWidth: '400px',
  height: '100%',
  backgroundColor: '#18191D',
  [theme.breakpoints.down('desktop')]: {
    order: 2,
    // maxWidth: '500px',
    width: '100%'
  },
  [theme.breakpoints.down('md')]: {
    order: 2
  }
}));

const PairTableContainer = styled(Box)(({ theme }) => ({
  minWidth: '400px',
  width: '100%',
  height: '100%',
  minHeight: '560px',
  backgroundColor: '#18191D',
  display: 'none',
  [theme.breakpoints.down('desktop')]: {
    display: 'block',
    order: 2
  },
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));
