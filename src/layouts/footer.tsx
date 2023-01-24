import { Box, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { SiQuantconnect } from 'react-icons/si';
import { TbPlugConnectedX } from 'react-icons/tb';
import { Container } from '../../src/components/Container';
import { GasStationSvg } from '../../src/config/images';
import { lastOracleTime } from 'src/context/socket';
import { ethers } from 'ethers';
import { useNetwork } from 'wagmi';

declare const window: any
const { ethereum } = window;

export const Footer = () => {
  
  const [lastData, setLastData] = useState(0);
  const [dateNow, setDateNow] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);

  const { chain } = useNetwork();

  useEffect(() => {
    const interval = setInterval(() => {
      setLastData(lastOracleTime);
      setDateNow(Date.now());
    }, 500);

    return () => {
      clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    provider.getGasPrice().then((r) => {
      setGasPrice(parseFloat(parseFloat(r.toString()).toPrecision(3))/1e9);
    });
    const interval = setInterval(() => {
      provider.getGasPrice().then((r) => {
        setGasPrice(parseFloat(parseFloat(r.toString()).toPrecision(3))/1e9);
      });
    }, 10000);

    return () => {
      clearInterval(interval);
    }
  }, [chain]);

  return (
    <FooterContainer>
      <Container>
        <FooterWrapper>
          <FooterInfo>
            <TextCoin>
              {
                dateNow > lastData+10000 ?
                  <TbPlugConnectedX color={'#FF0000'} /> :
                dateNow > lastData+3000 ?
                  <SiQuantconnect color={'#FFFF00'} /> :
                  <BsFillCheckCircleFill color={'#219653'} />
              }
              <Text>Oracle</Text>
            </TextCoin>
            <GasFee>
              <img src={GasStationSvg} alt="gas-station" style={{ width: '12px', height: '12px' }} />
              <SmallText>Gas Price: {gasPrice} Gwei</SmallText>
            </GasFee>
          </FooterInfo>
          <Line />
          <FooterNav>
            <NavLinks>
              <SmallText sx={{cursor: 'pointer'}} onClick={() => window.open("https://docs.tigris.trade", '_blank')}>Docs</SmallText>
              <SmallText sx={{cursor: 'pointer'}} onClick={() => window.open("https://discord.gg/tigris", '_blank')}>Discord</SmallText>
              <SmallText sx={{cursor: 'pointer'}} onClick={() => window.open("https://twitter.com/tigristrades", '_blank')}>Twitter</SmallText>
            </NavLinks>
            <SmallText>© 2023. All rights reserved</SmallText>
          </FooterNav>
        </FooterWrapper>
      </Container>
    </FooterContainer>
  );
};

const FooterContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '50px',
  backgroundColor: '#18191D',
  alignItems: 'center',
  marginTop: '0px'
}));

const FooterWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  maxWidth: '1440px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}));

const FooterInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '2rem',
  minHeight: '50px',
  alignItems: 'center',
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
  lineHeight: '20px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '10px'
  }
}));

const SmallText = styled(Box)(({ theme }) => ({
  color: '#B1B5C3',
  fontWeight: '400',
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center',
  [theme.breakpoints.down('xs')]: {
    fontSize: '10px'
  }
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
