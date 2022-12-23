import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { useState } from 'react';
import { Dayjs } from 'dayjs';
import { TigrisDateRangePicker } from '../DateRangePicker';
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import { TradeLogsTable } from '../Table/TradeLogsTable';

export const TradingLogsBoard = () => {
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]);
  return (
    <TableContainer>
      <TableWrapper>
        <TableTopBar>
          <TableTitle>Log of trades</TableTitle>
          <TableAction>
            <TigrisDateRangePicker value={dateRange} setValue={setDateRange} />
          </TableAction>
        </TableTopBar>
        <TradeLogsTable />
      </TableWrapper>
    </TableContainer>
  );
};

const TableContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  [theme.breakpoints.down('desktop')]: {
    order: 4,
    gridColumn: '1 / 3'
  }
}));

const TableWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#18191D',
  width: '100%'
}));

const TableTopBar = styled(Box)(({ theme }) => ({
  padding: '19px 17px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '10px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
}));

const TableTitle = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '20px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase'
}));

const TableMedia = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: '100%',
  backgroundColor: '#18191D',
  padding: '10px 13px',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const TableAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '33.3px'
}));
