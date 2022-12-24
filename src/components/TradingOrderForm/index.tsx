import { ErrorOutline, Visibility } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useState, useRef, useEffect } from 'react';
import { TigrisInput, TigrisSlider } from '../Input';
import { useAccount, useNetwork } from 'wagmi';
import { oracleSocket } from 'src/context/socket';
import { getNetwork } from 'src/constants/networks';

declare const window: any
const { ethereum } = window;

interface IOrderForm {
  pairIndex: number;
}
export const TradingOrderForm = ({pairIndex}: IOrderForm) => {

  const decimals = useRef(2);

  useEffect(() => {
    oracleSocket.on('data', (data: any) => {
      if (orderTypeRef.current === "Market") {
        setOpenPrice(parseFloat((data[currentPairIndex.current].price/1e18).toFixed(decimals.current)));
        setSpread(parseFloat((data[currentPairIndex.current].spread/1e10).toFixed(5)));
      }
    });
  }, []);

  const currentPairIndex = useRef(pairIndex);

  useEffect(() => {
    currentPairIndex.current = pairIndex;
    decimals.current = getNetwork(0).assets[currentPairIndex.current].decimals;
  }, [pairIndex]);

  const [isLong, setLong] = useState(true);
  const [openPrice, setOpenPrice] = useState(0);
  const [spread, setSpread] = useState(0.0002);

  const [margin, setMargin] = useState(5);
  const [leverage, setLeverage] = useState(2);
  const [stopLoss, setStopLoss] = useState(0);
  const [takeProfit, setTakeProfit] = useState(500);

  const [orderType, setOrderType] = useState("Market");
  const orderTypeRef = useRef(orderType);
  useEffect(() => {
    orderTypeRef.current = orderType;
  }, [orderType]);

  function handleMarginChange(event: any) {
    setMargin(marginScale(event.target.value));
  }

  function handleLeverageChange(event: any) {
    setLeverage(event.target.value);
  }

  function handleStopLossChange(event: any) {
    setStopLoss(event.target.value);
  }

  function handleTakeProfitChange(event: any) {
    setTakeProfit(event.target.value);
  }

  function handleSetOpenPrice(value: any) {
    if (orderType === "Market") {
      setOrderType("Limit");
    }
    setOpenPrice(value);
  }

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
        <FormAction sx={{marginTop: '30px'}}>
          <OrderTypeButton
            onClick={() => setOrderType("Market")}
            sx={{
              backgroundColor: orderType === "Market" ? '#3772ff' : '#222630',
              color: orderType === "Market" ? '#FFFFFF' : '#777E90',
              '&:hover': { backgroundColor: orderType === "Market" ? '#3772ff' : '#222630', color: orderType === "Market" ? '#FFFFFF' : '#3772ff' }
            }}
          >
            Market
          </OrderTypeButton>
          <OrderTypeButton
            onClick={() => setOrderType("Limit")}
            sx={{
              backgroundColor: orderType === "Limit" ? '#3772ff' : '#222630',
              color: orderType === "Limit" ? '#FFFFFF' : '#777E90',
              '&:hover': { backgroundColor: orderType === "Limit" ? '#3772ff' : '#222630', color: orderType === "Limit" ? '#FFFFFF' : '#3772ff' }
            }}
          >
            Limit
          </OrderTypeButton>
          <OrderTypeButton
            onClick={() => setOrderType("Stop")}
            sx={{
              backgroundColor: orderType === "Stop" ? '#3772ff' : '#222630',
              color: orderType === "Stop" ? '#FFFFFF' : '#777E90',
              '&:hover': { backgroundColor: orderType === "Stop" ? '#3772ff' : '#222630', color: orderType === "Stop" ? '#FFFFFF' : '#3772ff' }
            }}
          >
            Stop
          </OrderTypeButton>
        </FormAction>
        <FormArea>
          <TigrisInput label="Open price" value={
            getOpenPrice()
          } setValue={
            handleSetOpenPrice
            } />
          <div style={{pointerEvents: 'none'}}>
          <TigrisInput label="Liq price" value={liqPrice()} setValue={() => null} />
          </div>
          <TigrisInput label="Leverage" value={leverage} setValue={setLeverage} />
          <TigrisInput label="Margin" value={margin} setValue={setMargin} />
          <TigrisSlider // Leverage
            defaultValue={2}
            aria-label="Default"
            valueLabelDisplay="auto"
            marks={[
              {
                value: 2,
                label: '2'
              },
              {
                value: 25,
                label: '25'
              },
              {
                value: 50,
                label: '50'
              },
              {
                value: 75,
                label: '75'
              },
              {
                value: 100,
                label: '100'
              }
            ]}
            min={2}
            max={100}
            onChange={(event: any) => handleLeverageChange(event)}
            value={leverage}
          />
          <TigrisSlider // Margin
            defaultValue={Math.sqrt(5)}
            aria-label="Default"
            valueLabelDisplay="auto"
            marks={[
              { value: Math.sqrt(5), label: '5' },
              { value: 100, label: '10000' }
            ]}
            min={Math.sqrt(5)}
            step={0.01}
            max={100}
            scale={(value: number) =>
              marginScale(value)
            }
            onChange={(event: any) => handleMarginChange(event)}
            value={Math.sqrt(margin)}
          />
          <TigrisInput label="Stop Loss" value={-stopLoss} setValue={setStopLoss} />
          <TigrisInput label="Take profit" value={takeProfit} setValue={setTakeProfit} />
          <TigrisSlider // Stop Loss
            defaultValue={0}
            aria-label="Default"
            valueLabelDisplay="auto"
            min={0}
            step={1}
            max={90}
            scale={(value) => -value}
            marks={[
              { value: 0, label: '0' },
              { value: 90, label: '-90' }
            ]}
            onChange={(event: any) => handleStopLossChange(event)}
            value={stopLoss}
          />
          <TigrisSlider // Take profit
            defaultValue={500}
            aria-label="Default"
            valueLabelDisplay="auto"
            min={0}
            step={1}
            max={500}
            marks={[
              { value: 0, label: '0' },
              { value: 500, label: '500' }
            ]}
            onChange={(event: any) => handleTakeProfitChange(event)}
            value={takeProfit}
          />
          <AssetBalance>
            Asset balance <Visibility fontSize="small" />{' '}
          </AssetBalance>
          <MarginAssetValue>
            <span>2.5749 BTC</span>
            <span> ≈ 61,075.53 USD</span>
          </MarginAssetValue>
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

  function liqPrice() {
    if (isLong) {
      return parseFloat((getOpenPrice() - getOpenPrice()*0.9/leverage).toFixed(decimals.current));
    } else {
      return parseFloat((getOpenPrice() + getOpenPrice()*0.9/leverage).toFixed(decimals.current));
    }
  }

  function getOpenPrice() {
    if (isLong) {
      return parseFloat((openPrice + openPrice * spread).toFixed(decimals.current));
    } else {
      return parseFloat((openPrice - openPrice * spread).toFixed(decimals.current));
    }
  }

  function marginScale(value: number) {
    return Math.round(
      parseInt((Math.ceil(value ** 2 / 100) * 100).toString()) % 1000 === 0
        ? parseInt((Math.ceil(value ** 2 / 100) * 100).toString())
        : value ** 2
    );
  }
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
  borderRadius: '0px',
  clipPath: ' polygon(0 0, 100% 0, 92% 100%, 0 99%);'
}));

const ShortButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: '0px',
  clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 99%)'
}));

const OrderTypeButton = styled(Button)(({ theme }) => ({
  width: '50%',
  height: '100%',
  borderRadius: '0px',
  margin: '2px'
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

const MarginAssetValue = styled(Box)(({ theme }) => ({
  fontSize: '13px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '10px'
  }
}));

const ApproveDaiButton = styled(Button)(({ theme }) => ({
  marginTop: '17px',
  borderRadius: '0px',
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
