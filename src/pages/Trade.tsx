import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from 'src/components/Container';
import { TokenDetails } from 'src/components/page-elements/TokenDetails';
import { PairSelectionTable } from 'src/components/PairSelectionTable';
import TradingChart from 'src/components/TradingChart/TradingChart';
import { TradingOrderForm } from 'src/components/TradingOrderForm';
import { TradingPositionTable } from 'src/components/TradingPositionTable';

export const Trade = () => {
  const [pairIndex, setPairIndex] = React.useState(localStorage.getItem("LastPairSelected") ? localStorage.getItem("LastPairSelected") as unknown as number : 0);
  const [pendingChartLine, setPendingChartLine] = React.useState(0);
  const [prices, setPrices] = React.useState([]);
  return (
    <TradeContainer>
      <TokenDetails />
      <Container>
        <TradingForm>
          <TradingSection>
            <TradingChart asset={pairIndex} prices={prices} pendingLine={pendingChartLine} />
          </TradingSection>
          <PairSelectionTable setPairIndex={setPairIndex}/>
          <TradingPositionTable />
          <TradingOrderForm />
        </TradingForm>
      </Container>
    </TradeContainer>
  );
};

const TradeContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column'
});

const TradingForm = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '14px',
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
