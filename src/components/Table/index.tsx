import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
];

export const PositionTable = () => {
  return (
    <TableContainer>
      <Table size="small" aria-label="a dense table">
        <CustomTableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </CustomTableHead>
        <CustomTableBody>
          {rows.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0, margin: 0, padding: 0 } }}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </CustomTableBody>
      </Table>
    </TableContainer>
  );
};

const TableContainer = styled(Box)(({ theme }) => ({
  fontSize: '12px'
}));

const CustomTableHead = styled(TableHead)(({ theme }) => ({
  '.MuiTableCell-root': {
    color: '#777E90',
    fontSize: '12px',
    paddingTop: '0 !important',
    paddingBottom: '0 !important'
  }
}));

const CustomTableBody = styled(TableBody)(({ theme }) => ({
  'MuiTableCell-root': {
    color: '#777E90',
    fontSize: '12px',
    paddingTop: '0 !important',
    paddingBottom: '0 !important'
  }
}));
