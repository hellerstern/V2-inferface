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
    TraderProfile();
  }, [address, chain]);

  return (
    <TradeContainer>
      {miniPage === 0 && (
        <>
          <Chatbox />
          <TokenDetails
            pairIndex={pairIndex}
            setPairIndex={setPairIndex}
          />
          <Container>
            <TradingForm>
              <TradingSection>
                <TradingChart asset={pairIndex} positionData={positionData} />
              </TradingSection>
              <OrderFormContainer>
                <TradingOrderForm pairIndex={pairIndex}/>
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
