import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { useState } from 'react';
import { TokenDropMenu } from '../Dropdown/TokenDrop';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import priceData from './btcdata.json';
import './index.css';

export const CumulativeChart = () => {
  const [token, setToken] = useState('BTC/USDT');

  const configPrice = {
    yAxis: [
      {
        offset: 20,
        labels: {
          x: -15,
          style: {
            color: '#777E90',
            position: 'absolute'
          },
          align: 'left'
        }
      }
    ],
    tooltip: {
      shared: true,
      style: {
        color: '#777E90'
      }
    },
    plotOptions: {
      series: {
        showInNavigator: true,
        gapSize: 6,
        animation: false
      }
    },
    chart: {
      height: 500,
      animation: false
    },

    credits: {
      enabled: false
    },

    legend: {
      enabled: true,
      style: {
        backgroundColor: 'red'
      }
    },
    xAxis: {
      type: 'date'
    },
    rangeSelector: {
      buttons: [
        {
          type: 'day',
          count: 1,
          text: '1d'
        },
        {
          type: 'day',
          count: 7,
          text: '7d'
        },
        {
          type: 'month',
          count: 1,
          text: '1m'
        },
        {
          type: 'month',
          count: 3,
          text: '3m'
        },
        {
          type: 'all',
          text: 'All'
        }
      ],
      selected: 4
    },
    series: [
      {
        name: 'Price',
        type: 'spline',
        data: priceData,
        tooltip: {
          valueDecimals: 2
        }
      }
    ]
  };
  return (
    <Container>
      <ChartAction>
        <TokenDropMenu state={token} setState={setToken} />
        <LabelGroup>
          <LabelPnL>
            <Label title="Daily PNL:" value="65.254K" valueColor="#219653" />
            <Label title="Weekly PNL:" value="2.418B" valueColor="#219653" />
          </LabelPnL>
          <Label title="N. of settled positions (24h):" value="0" valueColor="#FFFFFF" />
          <Label title="N. of settled positions (7d):" value="0" valueColor="#FFFFFF" />
        </LabelGroup>
      </ChartAction>
      <ChartContainer>
        <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={configPrice} />
      </ChartContainer>
    </Container>
  );
};

const Container = styled(Box)(({ theme }) => ({
  minHeight: '480px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#18191D',
  order: 4,
  [theme.breakpoints.down('desktop')]: {
    gridColumn: '1 / 3'
  }
}));

const ChartAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: '19px',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  }
}));

const LabelGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: '5px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}));

interface LabelProps {
  title: string;
  value: string;
  valueColor?: string;
}

const Label = (props: LabelProps) => {
  const { title, value, valueColor } = props;
  return (
    <LabelContainer>
      <LabelTitle>{title}</LabelTitle>
      <Box sx={{ color: valueColor }}>{value}</Box>
    </LabelContainer>
  );
};

const LabelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '5px',
  fontSize: '12px',
  lineHeight: '16px'
}));

const LabelTitle = styled(Box)(({ theme }) => ({
  color: '#777E91'
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%'
}));

const LabelPnL = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '5px'
}));
