import { ErrorOutline, Visibility } from '@mui/icons-material';
import { Box, Button, Slider } from '@mui/material';
import { styled } from '@mui/system';
import { useState } from 'react';
import { TigrisInput } from '../Input';

export const TradingOrderForm = () => {
  const [isLong, setLong] = useState(true);
  const [posSize, setPosSize] = useState(700);
  const [stopLoss, setStopLoss] = useState(150);
  const [price, setPrice] = useState(19.594825);
  const [leverage, setLeverage] = useState(20);
  const [margin, setMargin] = useState(5);
  const [profit, setProfit] = useState(54738942);
  return (
    <Container>
      <FormLabel>Order Form</FormLabel>
      <FormContainer>
        <FormAction>
          <LongButton
            onClick={() => setLong(true)}
            sx={{
              backgroundColor: isLong ? '#58BD7D' : '#222630',
              color: isLong ? '#FFFFFF' : '#777E90',
              '&:hover': { backgroundColor: isLong ? '#58BD7D' : '#222630' }
            }}
          >
            Long
          </LongButton>
          <ShortButton
            onClick={() => setLong(false)}
            sx={{
              backgroundColor: isLong ? '#222630' : '#EF5350',
              color: isLong ? '#777E90' : '#FFFFFF',
              '&:hover': { backgroundColor: isLong ? '#222630' : '#EF5350' }
            }}
          >
            Short
          </ShortButton>
        </FormAction>
        <FormArea>
          <TigrisInput label="Position Size" value={posSize} setValue={setPosSize} />
          <TigrisInput label="Liq price ($)" value={price} setValue={setPrice} />
          <TigrisInput label="Leverage" value={leverage} setValue={setLeverage} />
          <TigrisInput label="Margin" value={margin} setValue={setMargin} />
          <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
          <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
          <TigrisInput label="Stop Loss" value={stopLoss} setValue={setStopLoss} unit="%" />
          <TigrisInput label="Take profit" value={profit} setValue={setProfit} />
          <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
          <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
          <AssetBalance>
            Asset balance <Visibility fontSize="small" />{' '}
          </AssetBalance>
          <BitcoinValue>
            <span>2.5749 BTC</span>
            <span> ≈ 61,075.53 USD</span>
          </BitcoinValue>
        </FormArea>
        <ApproveDaiButton>Approve Dai</ApproveDaiButton>
        <Alert>
          <ErrorOutline sx={{ color: '#EB5757' }} fontSize="small" />
          <AlertContent>
            Wallet is not connected. Connect your wallet to be able approve DAI and use Order form.
          </AlertContent>
        </Alert>
      </FormContainer>
    </Container>
  );
};

const Container = styled(Box)(({ theme }) => ({
  minHeight: '560px',
  height: '100%',
  order: 3,
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    gridColumn: '1 / 3'
  }
}));

const FormLabel = styled(Box)(({ theme }) => ({
  backgroundColor: '#18191D',
  width: '100%',
  height: '50px',
  padding: '15px 14px',
  textTransform: 'uppercase',
  fontSize: '12px',
  lineHeight: '20px',
  letterSpacing: '0.1em',
  fontWeight: 700
}));

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: '#18191D',
  marginTop: '7px',
  padding: '20px 13px'
}));

const FormAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '36px'
}));

const LongButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: '4px',
  clipPath: ' polygon(0 0, 100% 0, 92% 100%, 0 99%);'
}));

const ShortButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: '4px',
  clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 99%)'
}));

const FormArea = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto auto',
  gap: '17px',
  paddingTop: '35px'
}));

const AssetBalance = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '12px',
  gap: '20%'
}));

const BitcoinValue = styled(Box)(({ theme }) => ({
  fontSize: '13px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '10px'
  }
}));

const ApproveDaiButton = styled(Button)(({ theme }) => ({
  marginTop: '17px',
  borderRadius: '4px',
  width: '100%',
  textTransform: 'none',
  backgroundColor: '#2F3135',
  '&:hover': {
    backgroundColor: '#2F3135'
  }
}));

const Alert = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  marginTop: '17px'
}));

const AlertContent = styled(Box)(({ theme }) => ({
  fontSize: '11px',
  lineHeight: '20px',
  color: 'rgba(177, 181, 195, 0.5)'
}));
