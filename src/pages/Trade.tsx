import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from 'src/components/Container';
import { TokenDetails } from 'src/components/page-elements/TokenDetails';
import { TradingDetailsTable } from 'src/components/TradingDetailsTable';
// import TradingChart from 'src/components/TradingChart/TradingChart';

export const Trade = () => {
  // const [cAsset, setAsset] = React.useState(0);
  // const [pendingChartLine, setPendingChartLine] = React.useState(0);
  // const [prices, setPrices] = React.useState([]);
  return (
    <TradeContainer>
      <TokenDetails />
      <Container>
        <TradingForm>
          <TradingChartSection>
            {/* <TradingChart asset={cAsset} prices={prices} pendingLine={pendingChartLine} /> */}
            Trading Chart
          </TradingChartSection>
          <TradingDetailsTable />
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
  display: 'flex',
  gap: '5px',
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column'
  }
}));

const TradingChartSection = styled(Box)({
  backgroundColor: 'gray',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '30px',
  width: '100%',
  height: '560px'
});
