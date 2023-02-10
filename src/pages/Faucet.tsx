import { Box, Button, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';
import { VaultInput } from 'src/components/Input';
import { BiLinkAlt } from 'react-icons/bi';
import { useAccount, useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PRIVATE_ROUTES } from 'src/config/routes';

export const Faucet = () => {

  const { address } = useAccount();

  return (
    <ReferralContainer>
      <ReferralLinkContainer>
        <ReferralLinkLabel>Faucet - dai and eth for practice</ReferralLinkLabel>
        <CreateLinkContainer>
          <CreateLinkButton>
            Request Tokens
          </CreateLinkButton>
        </CreateLinkContainer>
      </ReferralLinkContainer>
    </ReferralContainer>
  );
};

interface ReferralCardProps {
  value: string;
  name: string;
}

const ReferralCard = (props: ReferralCardProps) => {
  const { value, name } = props;
  return (
    <ReferralCardWrapper>
      <ReferralCardValue>{value}</ReferralCardValue>
      <ReferralCardName>{name}</ReferralCardName>
    </ReferralCardWrapper>
  );
};

const ReferralCardWrapper = styled(Box)(({ theme }) => ({
  padding: '27px 0 27px 49px',
  width: '268px',
  backgroundColor: '#18191D',
  [theme.breakpoints.down('lg')]: {
    width: '100%',
    padding: '27px 0 27px 30px'
  }
}));

const ReferralCardValue = styled(Box)(({ theme }) => ({
  fontSize: '25px',
  lineHeight: '33px',
  fontWeight: '500',
  [theme.breakpoints.down('lg')]: {
    fontSize: '20px',
    lineHeight: '26px'
  }
}));

const ReferralCardName = styled(Box)(({ theme }) => ({
  fontSize: '15px',
  lineHeight: '20px',
  fontWeight: '500',
  color: '#777E90',
  marginTop: '10px',
  [theme.breakpoints.down('lg')]: {
    fontSize: '13px',
    lineHeight: '17px'
  }
}));

const ReferralContainer = styled(Box)(({ theme }) => ({
  padding: '70px',
  display: 'flex',
  justifyContent: 'center',
  gap: '13px',
  [theme.breakpoints.down('lg')]: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  [theme.breakpoints.down(768)]: {
    padding: '70px 17px'
  }
}));

const ReferralLinkContainer = styled(Box)(({ theme }) => ({
  width: '590px',
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  [theme.breakpoints.down('lg')]: {
    width: '100%'
  }
}));

const ReferralLinkLabel = styled(Box)(({ theme }) => ({
  padding: '15px 27px',
  width: '100%',
  height: '50px',
  backgroundColor: '#18191D',
  fontSize: '12px',
  lineHeight: '20px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontWeight: '700'
}));

const CreateLinkContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '20px 20px',
  backgroundColor: '#18191D',
  fontSize: '12px',
  fontWeight: '400'
}));

const CodeLink = styled(Box)(({ theme }) => ({
  padding: '12px',
  color: '#777E90'
}));

const CreateLinkButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#3772FF',
  width: '100%',
  height: '40px',
  textTransform: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: '600',
  '&: hover': {
    backgroundColor: '#3772FF'
  }
}));

const ReferralLinks = styled(Box)(({ theme }) => ({
  padding: '16px',
  backgroundColor: '#18191D',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '13px'
}));

const LinkText = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '7px',
  fontSize: '12px',
  lineHeight: '20px',
  fontWeight: '400',
  color: '#777E90'
}));

const ReferredAddresses = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '90px',
  fontSize: '12px',
  lineHeight: '20px',
  fontWeight: '400',
  color: '#777E90',
  backgroundColor: '#18191D'
}));

const ReferralCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '13px',
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'row',
    width: '100%'
  },
  [theme.breakpoints.down(768)]: {
    display: 'grid',
    '&>*:nth-child(3)': {
      gridColumn: '1 / 3'
    }
  },
  [theme.breakpoints.down(390)]: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const BiLinkIcon = styled(BiLinkAlt)(({ theme }) => ({
  width: '20px',
  height: '20px',
  minWidth: '20px',
  minHeight: '20px',
  color: '#3772FF'
}));

const ReferralLink = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
}));
