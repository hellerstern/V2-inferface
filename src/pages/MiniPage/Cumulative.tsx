import { Box, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from '../../../src/components/Container';
import { NavigateNext } from '@mui/icons-material';
import { useStore } from '../../../src/context/StoreContext';
import { CumulativeChart } from '../../../src/components/CumulativeChart';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import { TigrisDatePicker } from '../../../src/components/DatePicker';
import { TradingLogsBoard } from '../../../src/components/TradeLogsTable';

export const Cumulative = () => {
  const { setMiniPage } = useStore();
  const [value, setValue] = useState<Dayjs | null>(null);
  return (
    <Container>
      <CumulativeContainer>
        <BreadCrumb>
          <TrippleDot>...</TrippleDot>
          <NavigateNext />
          <BreadItem active={0} onClick={() => setMiniPage(0)}>
            Trade
          </BreadItem>
          <NavigateNext />
          <BreadItem active={1}>Cumulative perfomance</BreadItem>
        </BreadCrumb>
        <ContentContainer>
          <CumulativeChartWrapper>
            <Bar>
              <BarTitle sx={{ textTransform: 'uppercase' }}>Cumulative perfomance</BarTitle>
            </Bar>
            <CumulativeChart />
          </CumulativeChartWrapper>
          <OverviewWrapper>
            <Bar>
              <BarTitle>Overview</BarTitle>
              <TigrisDatePicker value={value} setValue={setValue} />
            </Bar>
            <OverviewContent>
              <OverviewSeparator>
                <OverviewItem title={'Daily PNL ($)'} value="65,254 k" colorValue="rgba(255, 255, 255, 0.6)" />
                <OverviewItem title={'Daily PNL ($)'} value="140 %" colorValue="rgba(255, 255, 255, 0.6)" />
                <OverviewItem
                  title={'Number of settled positions (Last 24 hours)'}
                  value="7"
                  colorValue="rgba(255, 255, 255, 0.6)"
                />
                <OverviewItem
                  title={'Number of settled positions (Last 7 days)'}
                  value="21"
                  colorValue="rgba(255, 255, 255, 0.6)"
                />
              </OverviewSeparator>
              <ResponsiveDevider1 />
              <ResponsiveDevider2 />
              <OverviewSeparator>
                <OverviewItem title={'Take profit price'} value="0.34789247" colorValue="#27A69A" />
                <OverviewItem title={'Entry price'} value="0.29039402" colorValue="rgba(255, 255, 255, 0.6)" />
                <OverviewItem title={'Exit Price'} value="0.4598948585" colorValue="rgba(255, 255, 255, 0.6)" />
                <OverviewItem title={'Stop limit price'} value="0.4590594" colorValue="rgba(255, 255, 255, 0.6)" />
                <OverviewItem title={'Liq price'} value="0.3840934804" colorValue="#EF534F" />
                <ResponsiveDevider2 />
                <OverviewItem title={'Total volume traded'} value="8,3million" colorValue="#777E90" />
                <OverviewItem title={'Number of trades'} value="Number of trades" colorValue="#777E90" />
              </OverviewSeparator>
            </OverviewContent>
          </OverviewWrapper>
          <TradingLogsBoard />
        </ContentContainer>
      </CumulativeContainer>
    </Container>
  );
};

interface OverviewItemProps {
  title: string;
  value: string | number;
  colorValue: string;
}

const OverviewItem = (props: OverviewItemProps) => {
  const { title, value, colorValue } = props;
  return (
    <OverviewItemContainer>
      <ItemTitle>{title}</ItemTitle>
      <ItemValue sx={{ color: colorValue }}>{value}</ItemValue>
    </OverviewItemContainer>
  );
};

const OverviewItemContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const ItemTitle = styled(Box)(({ theme }) => ({
  color: '#777E90',
  fontSize: '12px',
  lineHeight: '20px'
}));

const ItemValue = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '20px'
}));

const CumulativeContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingTop: '50px'
}));

const TrippleDot = styled(Box)(({ theme }) => ({
  color: '#667085'
}));

const BreadCrumb = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}));

interface BreadItemProps {
  active: number;
}

const BreadItem = styled(Box)<BreadItemProps>(({ theme, active }) => ({
  color: active === 1 ? '#3772FF' : '#667085',
  fontSize: '14px',
  cursor: 'pointer'
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto auto',
  gap: '13px',
  paddingTop: '26px',
  [theme.breakpoints.down(1440)]: {
    display: 'flex',
    flexDirection: 'column',
    gridTemplateColumns: 'none'
  }
}));

const CumulativeChartWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  width: '100%'
}));

const Bar = styled(Box)(({ theme }) => ({
  padding: '10px 17.5px',
  width: '100%',
  background: '#18191D',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const BarTitle = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  letterSpacing: '0.1em',
  lineHeight: '20px',
  color: '#FFFFFF'
}));

const OverviewWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  minWidth: '310px'
}));

const OverviewContent = styled(Box)(({ theme }) => ({
  padding: '26px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  height: '100%',
  backgroundColor: '#18191D',
  [theme.breakpoints.down(1440)]: {
    flexDirection: 'row'
  },
  [theme.breakpoints.down(768)]: {
    flexDirection: 'column'
  }
}));

const OverviewSeparator = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%'
}));

const ResponsiveDevider1 = styled(Box)(({ theme }) => ({
  width: '1px',
  backgroundColor: '#343538',
  [theme.breakpoints.down(768)]: {
    display: 'none'
  }
}));

const ResponsiveDevider2 = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.down(1440)]: {
    display: 'none'
  }
}));
