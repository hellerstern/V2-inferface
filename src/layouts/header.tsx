import React from 'react';
import { Avatar, Box, Icon, IconButton, Modal, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from 'src/components/Container';
import { Indicator, LOGO } from 'src/config/images';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { a11yProps } from 'src/components/TabPanel';
import { useStore } from 'src/context/StoreContext';
import CustomizedMenus from 'src/components/Dropdown';
import { NotificationsNone, Person, Dehaze, Search, Close } from '@mui/icons-material';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
  const { page, setPage } = useStore();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setPage(newValue);
  };

  const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: 324,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2
  };

  return (
    <>
      <HeaderContainer>
        <Container>
          <ContainerWrapper>
            <TigrisLogo>
              <Img src={LOGO} alt="tigris-logo" />
            </TigrisLogo>
            <ActiveBar>
              <TabContainer>
                <Tabs
                  TabIndicatorProps={{ style: { backgroundColor: '#3772ff', height: '2px' } }}
                  value={page}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <CustomTab label="Trade" {...a11yProps(0)} />
                  <CustomTab label="Vault" {...a11yProps(1)} />
                  <CustomTab label="Governance" {...a11yProps(2)} />
                  <CustomTab label="Referral" {...a11yProps(3)} />
                  <CustomTab label="Documentation" {...a11yProps(3)} />
                  <CustomTab label={<Discord />} {...a11yProps(3)} />
                </Tabs>
              </TabContainer>
              <MobileTab onClick={handleOpen}>
                <Dehaze />
              </MobileTab>
              <Actions>
                <CustomizedMenus />
                <IconButton aria-label="alarm" component="label" sx={{ marginRight: 1 }}>
                  <NotificationsNone />
                </IconButton>
                <ConnectButton
                  showBalance={{
                    smallScreen: false,
                    largeScreen: true
                  }}
                />
                <Avatar sx={{ width: 30, height: 30, marginLeft: 1 }}>
                  <Person />
                </Avatar>
              </Actions>
            </ActiveBar>
            <MobileActiveBar>
              <IconButton aria-label="alarm" component="label">
                <Search />
              </IconButton>
              <IconButton aria-label="alarm" component="label">
                <NotificationsNone />
              </IconButton>
              <IconButton aria-label="alarm" component="label" onClick={handleOpen}>
                <Dehaze />
              </IconButton>
            </MobileActiveBar>
          </ContainerWrapper>
        </Container>
      </HeaderContainer>
      <Modal
        keepMounted
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <IconButton>
            <Close />
          </IconButton>
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
  borderBottom: '1px solid gray'
});

const ContainerWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  justifyContent: 'inherit',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'space-between'
  }
}));

const TigrisLogo = styled(Box)({
  width: '200px',
  height: 'auto'
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
  [theme.breakpoints.down('md')]: {
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
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    alignItems: 'center'
  }
}));
