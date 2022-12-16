import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import { Close, Edit } from '@mui/icons-material';
import { AiFillEye } from 'react-icons/ai';

function createData(
  user: string,
  pair: string,
  margin: number,
  leverage: number,
  price: number,
  pnl: number,
  profit: number,
  loss: number,
  liq: number
) {
  return { user, pair, margin, leverage, price, pnl, profit, loss, liq };
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
    '.ActionField': {
      visibility: 'visible'
    }
  }
}));

const rows = [
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804),
  createData('10-02 10:36:42', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934804)
];

export const PositionTable = () => {
  return (
    <TableContainer>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Pair</TableCell>
            <TableCell>Margin</TableCell>
            <TableCell>Leverage</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Pnl</TableCell>
            <TableCell>Take Profit</TableCell>
            <TableCell>Stop loss</TableCell>
            <TableCell>Liq</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <CustomTableBody>
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
              <TableCell>
                <TableCellContainer>
                  <VisibilityBox>
                    <AiFillEye style={{ fontSize: '12px', marginLeft: '0.5px' }} />
                  </VisibilityBox>{' '}
                  {row.user}
                </TableCellContainer>
              </TableCell>
              <TableCell>{row.pair}</TableCell>
              <TableCell>{row.margin}</TableCell>
              <TableCell>{row.leverage}x</TableCell>
              <TableCell>{row.price}</TableCell>
              <TableCell>{row.pnl}</TableCell>
              <TableCell>{row.profit}</TableCell>
              <TableCell>{row.loss} BUSD</TableCell>
              <TableCell>{row.liq}</TableCell>
              <TableCell>
                <ActionField id={index} />
              </TableCell>
            </StyledTableRow>
          ))}
        </CustomTableBody>
      </Table>
    </TableContainer>
  );
};

const TableContainer = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  '.MuiTableCell-root': {
    fontSize: '12px',
    padding: '2.5px 20px !important'
  }
}));

const CustomTableBody = styled(TableBody)(({ theme }) => ({
  '.MuiTableCell-root': {
    color: '#B1B5C3'
  }
}));

interface ActionFieldProps {
  id: number;
}

const ActionField = (props: ActionFieldProps) => {
  const { id } = props;
  return (
    <ActionCotainer className="ActionField">
      <EditButton onClick={() => console.log('Edit', id)}>
        Edit
        <Edit sx={{ fontSize: '18px' }} />
      </EditButton>
      <DeleteButton onClick={() => console.log('Delete', id)}>
        Delete
        <Close sx={{ fontSize: '18px' }} />
      </DeleteButton>
    </ActionCotainer>
  );
};

const ActionCotainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '10px'
}));

const EditButton = styled(Box)(({ theme }) => ({
  background: 'transparent',
  color: '#FFF',
  textTransform: 'none',
  cursor: 'pointer',
  display: 'flex',
  gap: '6px',
  alignItems: 'center'
}));

const DeleteButton = styled(Box)(({ theme }) => ({
  color: '#FA6060',
  background: 'transparent',
  textTransform: 'none',
  cursor: 'pointer',
  display: 'flex',
  gap: '6px',
  alignItems: 'center'
}));

const VisibilityBox = styled(Box)(({ theme }) => ({
  minWidth: '14px',
  maxWidth: '14px',
  minHeight: '14px',
  maxHeight: '14px',
  backgroundColor: 'rgba(225, 225, 225, 0.18)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const TableCellContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '8px'
}));
