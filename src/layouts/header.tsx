import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Box, Button, Divider, IconButton, Modal } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from '../../src/components/Container';
import { GasStationSvg, Indicator, FullLogo } from '../../src/config/images';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { a11yProps } from '../../src/components/TabPanel';
import { useStore } from '../../src/context/StoreContext';
import { NotificationsNone, Person, Dehaze, Search, Close } from '@mui/icons-material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import { CustomConnectButton } from '../../src/components/CustomConnectButton';
import { LanguageList } from '../../src/components/List/Language';
import { CurrencyList } from '../../src/components/List/Currency';
import { NavList } from '../../src/components/List/NavList';
import { AccountSetting } from '../../src/components/List/AccountSetting';
import { useNavigate } from 'react-router-dom';
import { TraderProfile } from 'src/context/profile';
import { getShellBalance } from 'src/shell_wallet';
import NotificationMenu from 'src/components/Menu/NotificationMenu';

// import { getShellBalance } from 'src/utils/shellWallet';
export const Header = () => {
  const navigate = useNavigate();
  const { page, setPage } = useStore();
  const { setMiniPage } = useStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [notiData, setNotiData] = useState<string[]>([]);
  const [notiCount, setNotiCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  const [gasBalance, setGasBalance] = React.useState('0.000');

  useEffect(() => {
    const x = async () => {
      const gBalance = await getShellBalance();
      const b = parseFloat(gBalance.toString()).toFixed(4);
      setGasBalance(b);
    };

    setInterval(() => {
      x();
    }, 10000);
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setPage(newValue);
  };

  useEffect(() => {
    if (isConnected) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      fetch(`http://localhost:5000/notification/data/${chain?.id}/${address}`).then((response) => {
        response.json().then((data) => {
          console.log({ data });
          setNotiData(data);
          setNotiCount(data.length);
        });
      });
    } else {
      setNotiData([]);
      setNotiCount(0);
    }
  }, [isConnected]);

  const handleBellClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotiCount(0);
    setAnchorEl(event.currentTarget);
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
            <TigrisLogo
              onClick={() => {
                setPage(0);
                setMiniPage(0);
                navigate('/');
              }}
            >
              <Img src={FullLogo} alt="tigris-logo" />
            </TigrisLogo>
            <ActiveBar>
              <TabContainer>
                <Tabs
                  TabIndicatorProps={{ style: { height: '0px' } }}
                  value={page}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <CustomTab
                    label="Trade"
                    {...a11yProps(0)}
                    onClick={() => {
                      setMiniPage(0);
                      navigate('/');
                    }}
                    style={{ color: page === 0 ? '#FFFFFF' : '#B1B5C3', fontWeight: page === 0 ? 500 : 400 }}
                  />
                  <CustomTab
                    label="Vault"
                    {...a11yProps(1)}
                    onClick={() => {
                      setMiniPage(0);
                      navigate('/');
                    }}
                    style={{ color: page === 1 ? '#FFFFFF' : '#B1B5C3', fontWeight: page === 1 ? 500 : 400 }}
                  />
                  <CustomTab
                    label="Governance"
                    {...a11yProps(2)}
                    onClick={() => {
                      setMiniPage(0);
                      navigate('/');
                    }}
                    style={{ color: page === 2 ? '#FFFFFF' : '#B1B5C3', fontWeight: page === 2 ? 500 : 400 }}
                  />
                  <CustomTab
                    label="Referral"
                    {...a11yProps(3)}
                    onClick={() => {
                      setMiniPage(0);
                      navigate('/');
                    }}
                    style={{ color: page === 3 ? '#FFFFFF' : '#B1B5C3', fontWeight: page === 3 ? 500 : 400 }}
                  />
                </Tabs>
              </TabContainer>
              <MobileTab onClick={() => setModalOpen(true)}>
                <Dehaze />
              </MobileTab>
              <Actions>
                <ShellButton onClick={() => navigate('/proxy')}>
                  <img src={GasStationSvg} alt="gas-station" style={{ width: '20px', height: '20px' }} />
                  <GasAmount>{gasBalance + (chain?.id === 137 ? ' MATIC' : ' ETH')}</GasAmount>
                </ShellButton>
                <ConnectButton
                  accountStatus="address"
                  showBalance={{
                    smallScreen: false,
                    largeScreen: true
                  }}
                />
                <IconButton
                  onClick={() => navigate('/profile/' + (TraderProfile().username as string))}
                  sx={{ marginLeft: 1 }}
                >
                  <Avatar sx={{ width: 30, height: 30 }}>
                    <Person />
                  </Avatar>
                </IconButton>
                <IconButton aria-label="alarm" component="label" sx={{ marginRight: 1 }} onClick={handleBellClick}>
                  <Badge
                    badgeContent={notiCount}
                    color="success"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                  >
                    <NotificationsNone />
                  </Badge>
                </IconButton>
              </Actions>
            </ActiveBar>
            <MobileActiveBar>
              <IconButton aria-label="alarm" component="label">
                <Search />
              </IconButton>

              <IconButton aria-label="alarm" component="label" sx={{ marginRight: 1 }} onClick={handleBellClick}>
                <Badge
                  badgeContent={notiCount}
                  color="success"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                >
                  <NotificationsNone />
                </Badge>
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
          <NotificationMenu state={anchorEl} setState={setAnchorEl} data={notiData} />
        </Box>
      </Modal>
    </>
  );
};

const HeaderContainer = styled(Box)({
  height: '60px',
  borderBottom: '1px solid #2E2E30',
  backgroundColor: '#141416'
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
  cursor: 'pointer',
  marginBottom: '-5px'
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
  [theme.breakpoints.down(1280)]: {
    display: 'block'
  }
}));

const TabContainer = styled(Box)(({ theme }) => ({
  borderBottom: 1,
  borderColor: 'divider',
  [theme.breakpoints.down(1280)]: {
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
