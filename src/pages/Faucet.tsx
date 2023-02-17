import { Box, Button, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PRIVATE_ROUTES } from 'src/config/routes';

export const Faucet = () => {
  const { address, isConnected } = useAccount();
  const [isEligible, setIsEligible] = useState(false);
  useEffect(() => {
    const x = async () => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const res = await fetch(`${PRIVATE_ROUTES.faucet_serverUrl}/check/${address}`);
      const result = await res.json();
      setIsEligible(result.eligible);
    };
    if (isConnected) {
      x();
    } else {
      setIsEligible(false);
    }
  }, [address]);

  const claim = () => {
    if (isConnected) {
      setIsEligible(false);
      toast.loading('Claiming tokens...');
      axios
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        .post(`${PRIVATE_ROUTES.faucet_serverUrl}/claim/${address}`)
        .then(() => {
          toast.dismiss();
          toast.success('Claimed 0.011 ETH + 1000 DAI');
        })
        .catch((err) => {
          toast.dismiss();
          toast.error('Faucet error!');
          console.log(err);
        });
    }
  };

  return (
    <PageContainer>
      <FaucetContainer>
        <Label>Faucet - 0.01 ETH and 1000 DAI for practice</Label>
        <ButtonContainer>
          {isEligible ? (
            <EnabledButton onClick={() => claim()}>Request tokens</EnabledButton>
          ) : (
            <DisabledButton>Already claimed</DisabledButton>
          )}
        </ButtonContainer>
      </FaucetContainer>
    </PageContainer>
  );
};

const PageContainer = styled(Box)(({ theme }) => ({
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

const FaucetContainer = styled(Box)(({ theme }) => ({
  width: '590px',
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  [theme.breakpoints.down('lg')]: {
    width: '100%'
  }
}));

const Label = styled(Box)(({ theme }) => ({
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

const ButtonContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '20px 20px',
  backgroundColor: '#18191D',
  fontSize: '12px',
  fontWeight: '400'
}));

const EnabledButton = styled(Button)(({ theme }) => ({
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

const DisabledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2F3135',
  width: '100%',
  height: '40px',
  textTransform: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: '600',
  '&: hover': {
    backgroundColor: '#2F3135'
  }
}));
