import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import { useAccount } from 'wagmi';
import { PRIVATE_ROUTES } from 'src/config/routes';
import { NETWORK } from 'src/constants/networks/polygon-main';
import axios from 'axios';
import { parseDate } from '../Menu/NotificationMenu';
import { ThreeDotsLoader } from '../ThreeDotsLoader';

function createData(
  position: string,
  symbol: string,
  positionSize: number,
  leverage: number,
  entryPrice: number,
  exitPrice: number,
  pnlPro: number,
  pnlDollar: number,
  orderType: string,
  date: string,
  time: string
) {
  return { position, symbol, positionSize, leverage, entryPrice, exitPrice, pnlPro, pnlDollar, orderType, date, time };
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#23262F'
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  },
  '.ActionField': {
    visibility: 'hidden'
  },
  '&:hover': {
    backgroundColor: '#777E90',
    '.MuiTableCell-root': {
      color: '#FFFFFF'
    },
    '.ActionField': {
      visibility: 'visible'
    }
  }
}));

interface LogsTableProps {
  setData: any;
}

interface logDataProps {
  position: string;
  symbol: string;
  positionSize: number;
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  pnlPro: number;
  pnlDollar: number;
  orderType: string;
  date: string;
  time: string;
}

export const TradeLogsTable = (props: LogsTableProps) => {
  const { setData } = props;
  const [logData, setLogData] = useState<logDataProps[]>([]);
  const [isLoading, setLoading] = useState(false);

  const { address } = useAccount();

  const fetchData = async () => {
    if (address !== undefined) {
      setLoading(true);
      const result = await axios.get(`${PRIVATE_ROUTES.serverUrl}/tradelogs/${address}`);
      const data = result.data;
      const len = data.length;
      if (len > 0) {
        const createArr = [];
        for (let i = 0; i < len; i++) {
          const position = data[i].position === true ? 'LONG' : 'SHORT';
          const symbol_idx = data[i].symbol;
          const symbol = NETWORK.assets[symbol_idx].name;
          const positionSize = data[i].positionSize;
          const leverage = data[i].leverage;
          const entryPrice = data[i].entryPrice;
          const exitPrice = data[i].exitPrice;
          const pnlPro = data[i].pnlpro;
          const pnlDollar = data[i].pnldollar;
          const orderType = data[i].orderType === 0 ? 'MARKET' : data[i].orderType === 1 ? 'LIMIT' : 'STOP';
          const date = parseDate(data[i].dateTime);
          const _date = date.split(', ')[0];
          const _dateTime = date.split(', ')[1];
          createArr.push(
            createData(
              position,
              symbol,
              positionSize,
              leverage,
              entryPrice,
              exitPrice,
              pnlPro,
              pnlDollar,
              orderType,
              _date,
              _dateTime
            )
          );
        }
        setLogData(createArr);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setData(logData);
  }, [logData]);
  return (
    <TableContainer>
      {isLoading ? (
        <ThreeDotsLoader />
      ) : (
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Position</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Position size</TableCell>
              <TableCell>Leverage</TableCell>
              <TableCell>Entry Price</TableCell>
              <TableCell>Exit price</TableCell>
              <TableCell>Pnl (%)</TableCell>
              <TableCell>Pnl ($)</TableCell>
              <TableCell>Order type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <CustomTableBody>
            {logData.map((row, index) => (
              <StyledTableRow key={index}>
                <TableCell>{row.position}</TableCell>
                <TableCell>{row.symbol}</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>{row.positionSize}</TableCell>
                <TableCell>{row.leverage}x</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>{row.entryPrice}</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>{row.exitPrice}</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>{row.pnlPro}</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>{row.pnlDollar}</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>{row.orderType}</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>{row.date}</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>{row.time}</TableCell>
              </StyledTableRow>
            ))}
          </CustomTableBody>
        </Table>
      )}
    </TableContainer>
  );
};

const TableContainer = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  overflowX: 'auto',
  '.MuiTableCell-root': {
    fontSize: '12px',
    padding: '2.5px 10px !important'
  }
}));

const CustomTableBody = styled(TableBody)(({ theme }) => ({
  '.MuiTableCell-root': {
    color: '#B1B5C3'
  }
}));
