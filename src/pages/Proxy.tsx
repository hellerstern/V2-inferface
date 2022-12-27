import { ErrorOutlineOutlined } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from 'src/components/Container';
import { useAccount } from 'wagmi';

const reduceAddress = (address: any) => {
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const res = address.slice(0, 8) + '...' + address.slice(-8);
  return res;
};

export const Proxy = () => {
  const { address, isConnected } = useAccount();
  return (
    <Container>
      <ProxyContainer>
        <ShellWalletMedia>
          <MediaBar>Shell Wallet</MediaBar>
          <MediaContent>
            <Notification>
              <ErrorOutlineOutlined sx={{ width: '20px', height: '20px', color: '#6FCF97', marginTop: '2px' }} />
              <AlertContent>
                Shell wallet is a frontend wallet that enables instant one-click trades. You need to fund the wallet
                with MATIC on Polygon or ETH on Arbitrum to start trading.
              </AlertContent>
            </Notification>
            <AddressSection>
              <p>Address</p>
              <DesktopAddress style={{ color: '#3772FF', fontSize: '14px', textTransform: 'capitalize' }}>
                {isConnected ? address : 'Wallet is not connected'}
              </DesktopAddress>
              <MobileAddress>{isConnected ? reduceAddress(address) : 'Wallet is not connected'}</MobileAddress>
            </AddressSection>
            <CopyAddressButton>Copy Shell Wallet Address</CopyAddressButton>
          </MediaContent>
        </ShellWalletMedia>
        <ShellWalletAction>
          <GasBalanceContainer>
            <GasBalance>0.0000 ETH</GasBalance>
            <p style={{ color: '#777E90', fontSize: '15px', lineHeight: '20px' }}>Shell Wallet Gas Balance</p>
          </GasBalanceContainer>
          <ApproveContainer>
            <ApprovePeriod>
              <TimeBox>
                <TimeValue>23</TimeValue>
                <TimeType>Hours</TimeType>
              </TimeBox>
              :
              <TimeBox>
                <TimeValue>59</TimeValue>
                <TimeType>Minutes</TimeType>
              </TimeBox>
              :
              <TimeBox>
                <TimeValue>00</TimeValue>
                <TimeType>Seconds</TimeType>
              </TimeBox>
            </ApprovePeriod>
          </ApproveContainer>
          <ApproveLabel>Shell Wallet Approve Period</ApproveLabel>
          <ButtonGroup>
            <ExtendApproveButton>Extend the approve period</ExtendApproveButton>
            <SendGasButton>Send 0.0005 ETH to the wallet</SendGasButton>
            <WithdrawButton>Withdraw balance</WithdrawButton>
          </ButtonGroup>
        </ShellWalletAction>
      </ProxyContainer>
    </Container>
  );
};

const ProxyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '13px',
  padding: '70px',
  justifyContent: 'center',
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  [theme.breakpoints.down(768)]: {
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  [theme.breakpoints.down('xs')]: {
    paddingLeft: '0',
    paddingRight: '0'
  }
}));

const ShellWalletMedia = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  width: '550px',
  [theme.breakpoints.down('lg')]: {
    width: '100%'
  }
}));

const MediaBar = styled(Box)(({ theme }) => ({
  padding: '15px 23px',
  fontSize: '12px',
  lineHeight: '20px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  backgroundColor: '#18191D'
}));

const MediaContent = styled(Box)(({ theme }) => ({
  padding: '23px',
  display: 'flex',
  flexDirection: 'column',
  gap: '23px',
  backgroundColor: '#18191D'
}));

const Notification = styled(Box)(({ theme }) => ({
  backgroundColor: '#141416',
  borderRadius: '5px',
  padding: '20px 16px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '9px'
}));

const AlertContent = styled(Box)(({ theme }) => ({
  color: '#777E90',
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: '400'
}));

const AddressSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  fontSize: '12px',
  lineHeight: '24px',
  color: '#B1B5C3',
  padding: '0 4px'
}));

const CopyAddressButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  backgroundColor: '#3772FF',
  '&:hover': {
    backgroundColor: '#3772FF'
  },
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '40px',
  width: '100%',
  textTransform: 'none',
  fontSize: '14px',
  lineHeight: '24px'
}));

const ShellWalletAction = styled(Box)(({ theme }) => ({
  //   width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alingItems: 'center',
  backgroundColor: '#18191D',
  width: '400px',
  [theme.breakpoints.down('lg')]: {
    width: '100%'
  }
}));

const GasBalanceContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '10px',
  padding: '28px',
  borderBottom: '1px solid #1F2332'
}));

const GasBalance = styled(Box)(({ theme }) => ({
  fontSize: '25px',
  lineHeight: '33px',
  fontWeight: '500'
}));

const ApproveContainer = styled(Box)(({ theme }) => ({
  padding: '28px',
  width: '100%'
}));

const ApprovePeriod = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: '11px',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '20px',
  alignItems: 'center'
}));

const TimeBox = styled(Box)(({ theme }) => ({
  width: '95px',
  height: '84px',
  backgroundColor: '#222630',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '11px'
}));

const TimeValue = styled(Box)(({ theme }) => ({
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '20px'
}));

const TimeType = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '20px',
  fontWeight: '700',
  color: '#777E90'
}));

const ApproveLabel = styled(Box)(({ theme }) => ({
  color: '#777E90',
  fontSize: '15px',
  lineHeight: '20px',
  fontWeight: '500',
  textAlign: 'center',
  marginTop: '-14px'
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  padding: '28px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
}));

const ExtendApproveButton = styled(Button)(({ theme }) => ({
  background: 'none',
  borderRadius: '4px',
  width: '100%',
  height: '40px',
  textTransform: 'none',
  border: '1px solid #3772FF',
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: '700'
}));

const SendGasButton = styled(Button)(({ theme }) => ({
  marginT: '10px',
  backgroundColor: '#3772FF',
  borderRadius: '4px',
  width: '100%',
  height: '40px',
  textTransform: 'none',
  border: '1px solid #3772FF',
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: '700',
  '&:hover': {
    backgroundColor: '#3772FF'
  }
}));

const WithdrawButton = styled(Button)(({ theme }) => ({
  marginT: '10px',
  backgroundColor: 'none',
  borderRadius: '4px',
  width: '100%',
  height: '40px',
  textTransform: 'none',
  border: '1px solid #ffffff',
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: '700'
}));

const DesktopAddress = styled(Box)(({ theme }) => ({
  color: '#3772FF',
  fontSize: '14px',
  textTransform: 'capitalize',
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

const MobileAddress = styled(Box)(({ theme }) => ({
  color: '#3772FF',
  fontSize: '14px',
  textTransform: 'capitalize',
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    display: 'block'
  }
}));
