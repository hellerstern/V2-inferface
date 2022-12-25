/* eslint-disable */
// import React, { useContext, useCallback, useState, useEffect} from 'react';
// import {createChart, CrosshairMode} from 'lightweight-charts';
// import { SocketContext} from '../../context/socket';
import { TVChartContainer } from './TradingView/index';

type Props = {
  asset: any;
};

const TradingChart = ({ asset }: Props) => {
  return (
    <div style={{ width: '100%', height: '560px' }}>
      <TVChartContainer asset={asset} />
    </div>
  );
};

export default TradingChart;
