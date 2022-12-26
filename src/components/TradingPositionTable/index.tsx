import { OpenInNew } from '@mui/icons-material';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { useState } from 'react';
import { useStore } from '../../../src/context/StoreContext';
import { TableDropDownMenu } from '../Dropdown/tableDrop';
import { PositionTable } from '../Table/PositionTable';

interface TabBarProps {
  active: number;
}

export const TradingPositionTable = () => {
  const { setMiniPage } = useStore();
  const [tab, setTab] = useState(0);
  const [show, setShow] = useState('Before Closing Fees');
  return (
    <TableContainer>
      <TableWrapper>
        <TableAction>
          <TableTab>
            <TabBar active={tab === 0 ? 1 : 0} onClick={() => setTab(0)}>
              My Open Position(11)
            </TabBar>
            <TabBar active={tab === 1 ? 1 : 0} onClick={() => setTab(1)}>
              My Limit Orders
            </TabBar>
          </TableTab>
          <TableDropDown>
            <span>Show:</span>
            <TableDropDownMenu state={show} setState={setShow} />
          </TableDropDown>
        </TableAction>
        <PositionTable />
      </TableWrapper>
      <TableMedia>
        <TableMediaLabel>Daily Performance</TableMediaLabel>
        <TableMediaAction onClick={() => setMiniPage(1)}>
          Advanced Chart
          <OpenInNew fontSize="small" />
        </TableMediaAction>
      </TableMedia>
    </TableContainer>
  );
};

const TableContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  [theme.breakpoints.down('desktop')]: {
    order: 4,
    gridColumn: '1 / 3'
  }
}));

const TableWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#18191D',
  width: '100%',
  height: '100%'
}));

const TableAction = styled(Box)(({ theme }) => ({
  padding: '19px 17px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
}));

const TableTab = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '22px'
}));

const TabBar = styled(Box)<TabBarProps>(({ theme, active }) => ({
  fontSize: '12px',
  textTransform: 'uppercase',
  color: active === 1 ? '#FFFFFF' : '#777E90',
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

const TableMedia = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  backgroundColor: '#18191D',
  padding: '10px 13px',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const TableMediaLabel = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 700,
  lineHeight: '20px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase'
}));

const TableMediaAction = styled(Box)(({ theme }) => ({
  color: '#3772FF',
  fontSize: '12px',
  fontWeight: '400',
  lineHeight: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '11px',
  cursor: 'pointer'
}));
