import { ErrorOutline, Visibility } from '@mui/icons-material';
import { Box, Button, Slider } from '@mui/material';
import { styled } from '@mui/system';
import { useState } from 'react';
import { TigrisInput, TigrisSlider } from '../Input';

export const TradingOrderForm = () => {
  const [isLong, setLong] = useState(true);
  const [posSize, setPosSize] = useState(1000);
  const [stopLoss, setStopLoss] = useState(150);
  const [price, setPrice] = useState(18312.43);
  const [leverage, setLeverage] = useState(2);
  const [margin, setMargin] = useState(500);
  const [profit, setProfit] = useState(500);

  return (
    <Container>
      <FormLabel>Order Form</FormLabel>
      <FormContainer>
        <FormAction>
          <LongButton
            onClick={() => setLong(true)}
            sx={{
              backgroundColor: isLong ? '#26a69a' : '#222630',
              color: isLong ? '#FFFFFF' : '#777E90',
              '&:hover': { backgroundColor: isLong ? '#26a69a' : '#222630', color: isLong ? '#FFFFFF' : '#26a69a' }
            }}
          >
            Long
          </LongButton>
          <ShortButton
            onClick={() => setLong(false)}
            sx={{
              backgroundColor: isLong ? '#222630' : '#EF5350',
              color: isLong ? '#777E90' : '#FFFFFF',
              '&:hover': { backgroundColor: isLong ? '#222630' : '#EF5350', color: isLong ? '#EF5350' : '#FFFFFF' }
            }}
          >
            Short
          </ShortButton>
        </FormAction>
        <FormArea>
          <TigrisInput label="Trade size" value={posSize} setValue={setPosSize} />
          <TigrisInput label="Liq price" value={price} setValue={setPrice} />
          <TigrisInput label="Leverage" value={leverage} setValue={setLeverage} />
          <TigrisInput label="Margin" value={margin} setValue={setMargin} />
          <TigrisSlider defaultValue={2} aria-label="Default" valueLabelDisplay="auto" marks={
            [
              {
                value: 2,
                label: "2"
              },
              {
                value: 25,
                label: "25"
              },
              {
                value: 50,
                label: "50"
              },
              {
                value: 75,
                label: "75"
              },
              {
                value: 100,
                label: "100"
              }
            ]
          } min={2} max={100} />
          <TigrisSlider defaultValue={Math.sqrt(5)} aria-label="Default" valueLabelDisplay="auto" marks={[{ value: Math.sqrt(5), label: "5" }, { value: 100, label: "10000" }]} min={Math.sqrt(5)} step={0.01} max={100}
            scale={(value) => Math.round(
              parseInt((Math.ceil(value ** 2 / 100) * 100).toString()) % 1000 === 0 ? parseInt((Math.ceil(value ** 2 / 100) * 100).toString()) : value ** 2
            )}
          />
          <TigrisInput label="Stop Loss" value={stopLoss} setValue={setStopLoss} />
          <TigrisInput label="Take profit" value={profit} setValue={setProfit} />
          <TigrisSlider defaultValue={0} aria-label="Default" valueLabelDisplay="auto" min={0} step={1} max={90} scale={(value) => -value} marks={
            [
              { value: 0, label: "0" },
              { value: 90, label: "-90" }
            ]
          } />
          <TigrisSlider defaultValue={500} aria-label="Default" valueLabelDisplay="auto" min={0} step={1} max={500} marks={
            [
              { value: 0, label: "0" },
              { value: 500, label: "500" }
            ]
          } />
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
  padding: '20px 20px'
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