/* eslint-disable */
// import React, { useContext, useCallback, useState, useEffect} from 'react';
// import {createChart, CrosshairMode} from 'lightweight-charts';
// import { SocketContext} from '../../context/socket';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { TVChartContainer } from './TradingView/index';

interface Props {
  asset: any;
  positionData: any;
  positionTab: any;
}

const TradingChart = ({ asset, positionData, positionTab }: Props) => {
  return (
    <Wrapper>
      <TVChartContainer asset={asset} positionData={positionData} positionTab={positionTab}/>
    </Wrapper>
  );
};

const Wrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: '#17191D',
  userSelect: 'none',
  MozUserSelect: 'none',
  KhtmlUserSelect: 'none',
  WebkitUserSelect: 'none',
  [theme.breakpoints.down('desktop')]: {
    height: '640px'
  }
}));

export default TradingChart;
