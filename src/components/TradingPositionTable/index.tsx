import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { useState } from 'react';
import TableDropDownMenu from '../Dropdown/tableDrop';
import { PositionTable } from '../Table';

interface TabBarProps {
  active: boolean;
}

export const TradingPositionTable = () => {
  const [tab, setTab] = useState(0);
  const [show, setShow] = useState('Before Closing Fees');
  return (
    <TableContainer>
      <TableAction>
        <TableTab>
          <TabBar active={tab === 0} onClick={() => setTab(0)}>
            My Open Position(11)
          </TabBar>
          <TabBar active={tab === 1} onClick={() => setTab(1)}>
            My Limit Orders
          </TabBar>
        </TableTab>
        <TableDropDown>
          <span>Show:</span>
          <TableDropDownMenu state={show} setState={setShow} />
        </TableDropDown>
      </TableAction>
      <PositionTable />
    </TableContainer>
  );
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

const TableAction = styled(Box)(({ theme }) => ({
  padding: '19px 17px',
  display: 'flex',
  justifyContent: 'space-between'
}));

const TableTab = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '22px'
}));

const TabBar = styled(Box)<TabBarProps>(({ theme, active }) => ({
  fontSize: '12px',
  textTransform: 'uppercase',
  color: active ? '#FFFFFF' : '#777E90',
  cursor: 'pointer'
}));

const TableDropDown = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  span: {
    color: '#777E90',
    fontSize: '12px'
  }
}));
