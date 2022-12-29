import React from 'react';
import { Box, Tab, Tabs, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { SearchBar } from '../SearchBar';
import { a11yProps, TabPanel } from '../TabPanel';
import { Star } from '@mui/icons-material';
import { USDPairsTable } from './USDPairsTable';
import { BTCPairsTable } from './BTCPairsTable';
import { ForexPairsTable } from './ForexPairsTable';
import { CommodityPairsTable } from './CommodityPairsTable';
import { FavPairsTable } from './FavPairsTable';

interface PairSelectionTableProps {
  isMobile: boolean;
  setPairIndex: any;
  onClose?: () => void;
}

export const PairSelectionTable = ({ setPairIndex, isMobile, onClose }: PairSelectionTableProps) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSearchQuery('');
    setValue(newValue);
  };

  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value.toUpperCase());
  };

  return (
    <TradingDetailContainer>
      <SearchContainer>
        <Box sx={{ padding: '15px 20px 0 9px', display: 'flex', gap: '18px', alignItems: 'center' }}>
          <SearchBar onChange={handleSearch} />
          {isMobile && (
            <Box sx={{ cursor: 'pointer' }} onClick={onClose}>
              Cancel
            </Box>
          )}
        </Box>
        <TabsContainer sx={{ borderColor: 'divider' }}>
          <IconButton onClick={() => setValue(4)} sx={{ padding: '0px' }}>
            <Star sx={{ color: '#FABE3C', width: '20px', height: '20px' }} />
          </IconButton>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{ style: { backgroundColor: value === 4 ? '#FABE3C' : '#3772ff', height: '2px' } }}
            sx={{ height: '30px', overflow: 'auto', '& .MuiTabs-scroller': { overflow: 'auto !important' } }}
          >
            <CustomTab label="USD Pairs" {...a11yProps(0)} />
            <CustomTab label="BTC pairs" {...a11yProps(1)} />
            <CustomTab label="Forex" {...a11yProps(2)} />
            <CustomTab label="Commodities" {...a11yProps(3)} />
          </Tabs>
        </TabsContainer>
        <TabPanel value={value} index={0}>
          <USDPairsTable setPairIndex={setPairIndex} searchQuery={searchQuery} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <BTCPairsTable setPairIndex={setPairIndex} searchQuery={searchQuery} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ForexPairsTable setPairIndex={setPairIndex} searchQuery={searchQuery} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <CommodityPairsTable setPairIndex={setPairIndex} searchQuery={searchQuery} />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <FavPairsTable setPairIndex={setPairIndex} searchQuery={searchQuery} />
        </TabPanel>
      </SearchContainer>
    </TradingDetailContainer>
  );
};

const TradingDetailContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: '#18191D'
}));

const SearchContainer = styled(Box)({
  // padding: '15px 9px'
  // maxHeight: '560px'
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
