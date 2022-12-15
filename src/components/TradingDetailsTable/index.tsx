import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/system';
import { SearchBar } from '../SearchBar';
import { a11yProps, TabPanel } from '../TabPanel';
import { Star } from '@mui/icons-material';
import { USDPairsTable } from './USDPairsTable';

export const TradingDetailsTable = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <TradingDetailContainer>
      <SearchContainer>
        <Box sx={{ padding: '15px 9px 0 9px' }}>
          <SearchBar />
        </Box>
        <TabsContainer sx={{ borderColor: 'divider' }}>
          <Star sx={{ color: '#FABE3C', width: '20px', height: '20px' }} />
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{ style: { backgroundColor: '#3772ff', height: '2px' } }}
            sx={{ height: '30px' }}
          >
            <CustomTab label="USD Pairs" {...a11yProps(0)} />
            <CustomTab label="BTC pairs" {...a11yProps(1)} />
            <CustomTab label="Forex" {...a11yProps(2)} />
            <CustomTab label="commodities" {...a11yProps(3)} />
          </Tabs>
        </TabsContainer>
        <TabPanel value={value} index={0}>
          <USDPairsTable />
        </TabPanel>
        <TabPanel value={value} index={1}>
          BTC pairs
        </TabPanel>
        <TabPanel value={value} index={2}>
          Forex
        </TabPanel>
        <TabPanel value={value} index={3}>
          Commodities
        </TabPanel>
      </SearchContainer>
    </TradingDetailContainer>
  );
};

const TradingDetailContainer = styled(Box)(({ theme }) => ({
  minWidth: '400px',
  width: '400px',
  height: '100%',
  minHeight: '560px',
  backgroundColor: '#18191D',
  [theme.breakpoints.down('desktop')]: {
    order: 2
  },
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const SearchContainer = styled(Box)({
  // padding: '15px 9px'
});

const TabsContainer = styled(Box)({
  borderBottom: '1px solid gray',
  display: 'flex',
  alignItems: 'center',
  marginTop: '15px',
  padding: '0 9px'
});

const CustomTab = styled(Tab)({
  color: '#777E90',
  padding: 0,
  fontSize: '12px',
  height: '30px'
});
