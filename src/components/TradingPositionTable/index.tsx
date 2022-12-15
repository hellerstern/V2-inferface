import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const TradingPositionTable = () => {
  return <TableContainer></TableContainer>;
};

const TableContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: '#18191D',
  [theme.breakpoints.down('desktop')]: {
    height: '500px',
    order: 4,
    gridColumn: '1 / 3'
  }
}));
