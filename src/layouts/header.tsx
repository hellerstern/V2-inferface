import React from 'react';
import { Avatar, Box, Button, Divider, IconButton, Modal } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from '../../src/components/Container';
import { GasStationSvg, Indicator, FullLogo } from '../../src/config/images';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { a11yProps } from '../../src/components/TabPanel';
import { useStore } from '../../src/context/StoreContext';
import { CustomizedMenus } from '../../src/components/Dropdown/CurrencyDrop';
import { NotificationsNone, Person, Dehaze, Search, Close } from '@mui/icons-material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { CustomConnectButton } from '../../src/components/CustomConnectButton';
import { LanguageList } from '../../src/components/List/Language';
import { CurrencyList } from '../../src/components/List/Currency';
import { NavList } from '../../src/components/List/NavList';
import { AccountSetting } from '../../src/components/List/AccountSetting';
import { useNavigate } from 'react-router-dom';
import { TraderProfile } from 'src/context/profile';

// import { getShellBalance } from 'src/utils/shellWallet';
export const Header = () => {
  const navigate = useNavigate();
  const { page, setPage } = useStore();
  const [isModalOpen, setModalOpen] = React.useState(false);

  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  // React.useEffect(() => {
  //   console.log('shell-balance: ', getShellBalance());
  // }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setPage(newValue);
  };

  const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: 340,
    maxHeight: '100vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    overflow: 'auto'
  };

  return (
    <>
      <HeaderContainer>
        <Container>
          <ContainerWrapper>
            <TigrisLogo onClick={() => navigate('/')}>
              <Img src={FullLogo} alt="tigris-logo" />
            </TigrisLogo>
            <ActiveBar>
              <TabContainer>
                <Tabs
                  TabIndicatorProps={{ style: { backgroundColor: '#3772ff', height: '2px' } }}
                  value={page}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <CustomTab label="Trade" {...a11yProps(0)} onClick={() => navigate('/')} />
                  <CustomTab label="Vault" {...a11yProps(1)} onClick={() => navigate('/')} />
                  <CustomTab label="Governance" {...a11yProps(2)} onClick={() => navigate('/')} />
                  <CustomTab label="Referral" {...a11yProps(3)} onClick={() => navigate('/')} />
                  <CustomTab label={<Discord />} {...a11yProps(3)} onClick={() => navigate('/')} />
                </Tabs>
              </TabContainer>
              <MobileTab onClick={() => setModalOpen(true)}>
                <Dehaze />
              </MobileTab>
              <Actions>
                <CustomizedMenus />
                <IconButton aria-label="alarm" component="label" sx={{ marginRight: 1 }}>
                  <NotificationsNone />
                </IconButton>
                <ShellButton onClick={() => navigate('/proxy')}>
                  <img src={GasStationSvg} alt="gas-station" style={{ width: '20px', height: '20px' }} />
                  <GasAmount>0.000 ETH</GasAmount>
                </ShellButton>
                <ConnectButton
                  accountStatus="address"
                  showBalance={{
                    smallScreen: false,
                    largeScreen: true
                  }}
                />
                <IconButton onClick={() => navigate('/profile/'+(TraderProfile().username as string))} sx={{marginLeft: 1}}>
                  <Avatar sx={{ width: 30, height: 30 }}>
                    <Person />
                  </Avatar>
                </IconButton>
              </Actions>
            </ActiveBar>
            <MobileActiveBar>
              <IconButton aria-label="alarm" component="label">
                <Search />
              </IconButton>
              <IconButton aria-label="alarm" component="label">
                <NotificationsNone />
              </IconButton>

              <IconButton aria-label="alarm" component="label" onClick={() => setModalOpen(true)}>
                <Dehaze />
              </IconButton>
            </MobileActiveBar>
          </ContainerWrapper>
        </Container>
      </HeaderContainer>
      <Modal
        keepMounted
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <ModalContainer>
            <IconButton sx={{ width: 40, height: 40 }} onClick={() => setModalOpen(false)}>
              <Close />
            </IconButton>
            <WalletButtons>
              {isConnected ? (
                <>
                  <ContAddy>
                    {address?.slice(0, 4)}...{address?.slice(-4)}
                  </ContAddy>
                  <Disconnect onClick={() => disconnect()}>Disconnect wallet</Disconnect>{' '}
                </>
              ) : (
                <CustomConnectButton />
              )}
            </WalletButtons>
            <MobileShellButton onClick={() => navigate('/proxy')}>
              <img src={GasStationSvg} alt="gas-station" style={{ width: '20px', height: '20px' }} />
              <GasAmount>0.000 ETH</GasAmount>
            </MobileShellButton>
          </ModalContainer>
          <LanguageList />
          <CurrencyList />
          <Divider />
          <NavList />
          <Divider />
          <AccountSetting />
        </Box>
      </Modal>
    </>
  );
};

const Discord = () => {
  return (
    <DiscordContainer>
      <Box>Discord</Box>
      <SubFix src={Indicator} alt="indicator" />
    </DiscordContainer>
  );
};

const DiscordContainer = styled(Box)({
  display: 'flex',
  gap: '5px'
});

const SubFix = styled('img')({
  marginTop: '-10px'
});

const HeaderContainer = styled(Box)({
  height: '60px',
  borderBottom: '1px solid #2E2E30'
});

const ContainerWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  justifyContent: 'inherit',
  [theme.breakpoints.down('tablet')]: {
    justifyContent: 'space-between'
  }
}));

const TigrisLogo = styled(Box)({
  width: '200px',
  height: 'auto',
  cursor: 'pointer'
});

const Img = styled('img')({
  width: 'auto',
  height: '30px'
});

const ActiveBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  [theme.breakpoints.down('tablet')]: {
    display: 'none'
  }
}));

const MobileTab = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'none',
  [theme.breakpoints.down('xl')]: {
    display: 'block'
  }
}));

const TabContainer = styled(Box)(({ theme }) => ({
  borderBottom: 1,
  borderColor: 'divider',
  [theme.breakpoints.down('xl')]: {
    display: 'none'
  }
}));

const CustomTab = styled(Tab)({
  color: '#ffffff',
  textTransform: 'none'
});

const Actions = styled(Box)({
  display: 'flex',
  alignItems: 'center'
});

const MobileActiveBar = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('tablet')]: {
    display: 'flex',
    alignItems: 'center'
  }
}));

const ShellButton = styled(Button)(({ theme }) => ({
  border: '1px solid #FFFFFF',
  background: '#191B1F',
  borderRadius: '0px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: 9,
  marginRight: '12px'
}));

const MobileShellButton = styled(Button)(({ theme }) => ({
  border: '1px solid #FFFFFF',
  borderRadius: '0px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}));

const GasAmount = styled(Box)(({ theme }) => ({
  fontWeight: '500',
  fontSize: '15px',
  lineHeight: '14px'
}));

const WalletButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between'
}));

const ContAddy = styled(Button)(({ theme }) => ({
  borderRadius: '0px',
  border: '1px solid #3772FF',
  backgroundColor: 'none',
  textTransform: 'none',
  padding: '5px 20px 5px 20px'
}));

const Disconnect = styled(Button)(({ theme }) => ({
  border: '1px solid #EB5757',
  borderRadius: '0px',
  color: '#EB5757',
  textTransform: 'none',
  padding: '5px 20px 5px 20px'
}));

const ModalContainer = styled(Box)(({ theme }) => ({
  padding: '1rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
}));
