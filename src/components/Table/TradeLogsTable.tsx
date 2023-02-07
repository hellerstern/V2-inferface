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
import axios from 'axios';

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

export const TradeLogsTable = (props: LogsTableProps) => {
  const [logData, setLogData] = useState({});

  const { address } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      if (address !== undefined) {
        const result = await axios.get(`${PRIVATE_ROUTES.serverUrl}/${address}`);
        console.log({ result });
      }
    };
  }, []);

  const rows = [
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM'),
    createData('SHORT', 'C98/BUSD', 700, 2.59, 1.483, 2.5094, 40.0, 4.584, 'STP LMT', '10-02-2022', '10:36:42 PM')
  ];
  const { setData } = props;
  React.useEffect(() => {
    setData(rows);
  }, []);
  return (
    <TableContainer>
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
          {rows.map((row, index) => (
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
