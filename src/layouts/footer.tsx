import { Box, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { Container } from 'src/components/Container';
import { GasStationSvg } from 'src/config/images';

export const Footer = () => {
  return (
    <FooterContainer>
      <FooterWrapper>
        <FooterInfo>
          <TextCoin>
            <BsFillCheckCircleFill color={'#58BD7D'} />
            <Text>BTC/USDT</Text>
          </TextCoin>
          <SmallText>Server time: 10-02 10:36:42 UTC</SmallText>
          <GasFee>
            <img src={GasStationSvg} alt="gas-station" style={{ width: '12px', height: '12px' }} />
            <SmallText>Gas fee: 2.22%</SmallText>
          </GasFee>
        </FooterInfo>
        <Line />
        <FooterNav>
          <NavLinks>
            <SmallText>Discord</SmallText>
            <SmallText>Twitter</SmallText>
            <SmallText>Telegram</SmallText>
          </NavLinks>
          <SmallText>© 2022. All rights reserved</SmallText>
        </FooterNav>
      </FooterWrapper>
    </FooterContainer>
  );
};

const FooterContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  minHeight: '50px',
  backgroundColor: '#18191D',
  alignItems: 'center'
}));

const FooterWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}));

const FooterInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '2rem',
  minHeight: '50px',
  alignItems: 'center',
  marginLeft: '2%',
  marginRight: '2%',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'space-between'
  },
  [theme.breakpoints.down('xs')]: {
    gap: '10px'
  }
}));

const TextCoin = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '5px',
  alignItems: 'center'
}));

const Text = styled(Box)(({ theme }) => ({
  fontWeight: '500',
  fontSize: '12px',
  lineHeight: '20px'
}));

const SmallText = styled(Box)(({ theme }) => ({
  color: '#B1B5C3',
  fontWeight: '400',
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center'
}));

const GasFee = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
}));

const FooterNav = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
  minHeight: '50px',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginRight: '2%',
  marginLeft: '2%'
}));

const NavLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '1rem'
}));

const Line = styled(Divider)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'block'
  }
}));
