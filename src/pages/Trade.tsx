import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from '../../src/components/Container';
import { TokenDetails } from '../../src/components/TokenDetails';
import { PairSelectionTable } from '../../src/components/PairSelectionTable';
import TradingChart from '../../src/components/TradingChart/TradingChart';
import { TradingOrderForm } from '../../src/components/TradingOrderForm';
import { TradingPositionTable } from '../../src/components/TradingPositionTable';
import { DailyPerformanceChart } from '../../src/components/DailyChart';
import { useStore } from '../../src/context/StoreContext';
import { Cumulative } from './MiniPage/Cumulative';

export const Trade = () => {
  const [pairIndex, setPairIndex] = useState(
    localStorage.getItem('LastPairSelected') ? (localStorage.getItem('LastPairSelected') as unknown as number) : 0
  );
  const { miniPage } = useStore();

  useEffect(() => {
    if (localStorage.getItem('FavPairs') === null) localStorage.setItem('FavPairs', '["BTC/USD", "ETH/USD"]');
  }, []);

  return (
    <TradeContainer>
      {miniPage === 0 && (
        <>
          <TokenDetails pairIndex={pairIndex} />
          <Container>
            <TradingForm>
              <TradingSection>
                <TradingChart asset={pairIndex} />
              </TradingSection>
              <PairSelectionTable setPairIndex={setPairIndex} />
              <TradingPositionTable setPairIndex={setPairIndex}/>
              <TradingOrderForm pairIndex={pairIndex}/>
              <DailyPerformanceChart />
            </TradingForm>
          </Container>
        </>
      )}
      {miniPage === 1 && <Cumulative />}
    </TradeContainer>
  );
};

const TradeContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column'
});

const TradingForm = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '5px',
  display: 'grid',
  gridTemplateColumns: '3fr 1fr',
  gap: '5px',
  [theme.breakpoints.down('desktop')]: {
    gridTemplateColumns: '1fr 3fr'
  }
}));

const TradingSection = styled(Box)(({ theme }) => ({
  // backgroundColor: 'gray',
  width: '100%',
  [theme.breakpoints.down('desktop')]: {
    gridColumn: '1 / 3',
    order: 1
  }
}));
