import { ErrorOutline, Visibility } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useState, useRef, useEffect } from 'react';
import { TigrisInput, TigrisSlider } from '../Input';
import { useAccount, useNetwork } from 'wagmi';
import { oracleSocket } from 'src/context/socket';

declare const window: any
const { ethereum } = window;

interface IOrderForm {
  pairIndex: number;
}
export const TradingOrderForm = ({pairIndex}: IOrderForm) => {

  useEffect(() => {
    oracleSocket.on('data', (data: any) => {
      if (orderTypeRef.current === "Market") {
        setOpenPrice((data[currentPairIndex.current].price/1e18).toString());
        setSpread((data[currentPairIndex.current].spread/1e10).toPrecision(5));
      }
    });
  }, []);

  const currentPairIndex = useRef(pairIndex);

  useEffect(() => {
    currentPairIndex.current = pairIndex;
  }, [pairIndex]);

  const [isLong, setLong] = useState(true);
  const [openPrice, setOpenPrice] = useState("0");
  const [spread, setSpread] = useState("0.0002");

  const [margin, setMargin] = useState("5");
  const [leverage, setLeverage] = useState("2");

  const [stopLossPrice, setStopLossPrice] = useState("0");
  const [takeProfitPrice, setTakeProfitPrice] = useState("0");
  const [stopLossPercent, setStopLossPercent] = useState("0");
  const [takeProfitPercent, setTakeProfitPercent] = useState("500");

  const [isSlFixed, setSlFixed] = useState(false);
  const [isTpFixed, setTpFixed] = useState(false);

  const [orderType, setOrderType] = useState("Market");
  const orderTypeRef = useRef(orderType);
  useEffect(() => {
    orderTypeRef.current = orderType;
  }, [orderType]);

  function handleDirectionChange(value: boolean) {
    setLong(value);
    handleTakeProfitChange({target: {value: parseFloat(takeProfitPercent)}});
    handleStopLossChange({target: {value: parseFloat(stopLossPercent)}});
  }

  function handleMarginChange(event: any) {
    setMargin(marginScale(parseFloat(event.target.value)).toString());
  }

  function handleLeverageChange(event: any) {
    setLeverage(event.target.value);
    if (!isTpFixed) {
      handleTakeProfitChange({target: {value: parseFloat(takeProfitPercent)}});
    } else {
      handleTakeProfitPriceChange(takeProfitPrice);
    }
    if (!isSlFixed) {
      handleStopLossChange({target: {value: parseFloat(stopLossPercent)}});
    } else {
      handleStopLossPriceChange(stopLossPrice);
    }
  }

  // Slider
  function handleStopLossChange(event: any) {
    setSlFixed(false);
    if (isLong) {
      setStopLossPrice((parseFloat(getOpenPrice()) - parseFloat(getOpenPrice())*(event.target.value/parseFloat(leverage))/100).toPrecision(6));
    } else {
      setStopLossPrice((parseFloat(getOpenPrice()) + parseFloat(getOpenPrice())*(event.target.value/parseFloat(leverage))/100).toPrecision(6));
    }
    setStopLossPercent(event.target.value.toString());
  }

  // Slider
  function handleTakeProfitChange(event: any) {
    setTpFixed(false);
    if (isLong) {
      setTakeProfitPrice((parseFloat(getOpenPrice()) + parseFloat(getOpenPrice())*(event.target.value/parseFloat(leverage))/100).toPrecision(6));
    } else {
      let _tpPrice = (parseFloat(getOpenPrice()) - parseFloat(getOpenPrice())*(event.target.value/parseFloat(leverage))/100);
      if (_tpPrice < 0) _tpPrice = 0;
      setTakeProfitPrice(_tpPrice.toPrecision(6))
    }
    setTakeProfitPercent(event.target.value.toString());
  }

  // Input Field
  function handleStopLossPriceChange(value: string) {
    setSlFixed(true);
    setStopLossPrice(value);
    if (isLong) {
      setStopLossPercent(((1-parseFloat(value)/parseFloat(getOpenPrice()))*100*parseFloat(leverage)).toString());
    } else {
      setStopLossPercent(((1-parseFloat(getOpenPrice())/parseFloat(value))*100*parseFloat(leverage)).toString());
    }
  }

  // Input Field
  function handleTakeProfitPriceChange(value: string) {
    setTpFixed(true);
    setTakeProfitPrice(value);
    if (isLong) {
      setTakeProfitPercent(((parseFloat(value)/parseFloat(getOpenPrice())-1)*100*parseFloat(leverage)).toString());
    } else {
      setTakeProfitPercent(((parseFloat(getOpenPrice())/parseFloat(value)-1)*100*parseFloat(leverage)).toString());
    }
  }

  function handleSetOpenPrice(value: any) {
    if (orderType === "Market") {
      setOrderType("Limit");
      setOpenPrice(parseFloat(value).toPrecision(5));
    } else {
      setOpenPrice(value);
    }
  }

  return (
    <Container>
      <FormLabel>Order Form</FormLabel>
      <FormContainer>
        <FormAction>
          <LongButton
            onClick={() => handleDirectionChange(true)}
            sx={{
              backgroundColor: isLong ? '#26a69a' : '#222630',
              color: isLong ? '#FFFFFF' : '#777E90',
              '&:hover': { backgroundColor: isLong ? '#26a69a' : '#222630', color: isLong ? '#FFFFFF' : '#26a69a' }
            }}
          >
            Long
          </LongButton>
          <ShortButton
            onClick={() => handleDirectionChange(false)}
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
          <TigrisInput label="Price" value={
            orderType === "Market" ? getOpenPrice() : openPrice
          } setValue={
            handleSetOpenPrice
            } />
          <div style={{cursor: 'not-allowed'}}>
          <div style={{pointerEvents: 'none'}}>
          <TigrisInput label="Liq Price" value={liqPrice()} setValue={() => null} />
          </div>
          </div>
          <TigrisInput label="Leverage" value={leverage.toString()} setValue={setLeverage} />
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
            value={parseFloat(leverage)}
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
            value={Math.sqrt(parseFloat(margin))}
          />
          <TigrisInput label="Stop Loss" value={stopLossPercent === "0" ? "-" : isSlFixed ? stopLossPrice : getStopLossPrice().replace('NaN', '-')} setValue={handleStopLossPriceChange} />
          <TigrisInput label="Take Profit" value={takeProfitPercent === "0" ? "-" : isTpFixed ? takeProfitPrice : parseFloat(getTakeProfitPrice()) < 0 ? "0.00000" : getTakeProfitPrice().replace('NaN', '-')} setValue={handleTakeProfitPriceChange} />
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
            value={parseFloat(parseFloat(stopLossPercent).toPrecision(4))}
          />
          <TigrisSlider // Take profit
            defaultValue={isLong ? 500 : parseFloat(leverage) < 5 ? parseFloat(leverage)*100 : 500}
            aria-label="Default"
            valueLabelDisplay="auto"
            min={0}
            step={1}
            max={isLong ? 500 : parseFloat(leverage) < 5 ? parseFloat(leverage)*100 : 500}
            marks={[
              { value: 0, label: '0' },
              { value: isLong ? 500 : parseFloat(leverage) < 5 ? parseFloat(leverage)*100 : 500, label: isLong ? 500 : parseFloat(leverage) < 5 ? parseFloat(leverage)*100 : 500 }
            ]}
            onChange={(event: any) => handleTakeProfitChange(event)}
            value={parseFloat(parseFloat(takeProfitPercent).toPrecision(4))}
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

  function getStopLossPrice() {
    if (isLong) {
      return (parseFloat(getOpenPrice()) - parseFloat(getOpenPrice())*(parseFloat(stopLossPercent)/parseFloat(leverage))/100).toPrecision(6);
    } else {
      return (parseFloat(getOpenPrice()) + parseFloat(getOpenPrice())*(parseFloat(stopLossPercent)/parseFloat(leverage))/100).toPrecision(6);
    }
  }

  function getTakeProfitPrice() {
    if (isLong) {
      return (parseFloat(getOpenPrice()) + parseFloat(getOpenPrice())*(parseFloat(takeProfitPercent)/parseFloat(leverage))/100).toPrecision(6);
    } else {
      return (parseFloat(getOpenPrice()) - parseFloat(getOpenPrice())*(parseFloat(takeProfitPercent)/parseFloat(leverage))/100).toPrecision(6);
    }
  }

  function liqPrice() {
    let _liqPrice;
    if (isLong) {
       _liqPrice = (parseFloat(getOpenPrice()) - parseFloat(getOpenPrice())*0.9/parseFloat(leverage)).toPrecision(6);
    } else {
      _liqPrice = (parseFloat(getOpenPrice()) + parseFloat(getOpenPrice())*0.9/parseFloat(leverage)).toPrecision(6);
    }
    if (_liqPrice === "NaN") {
      return "-";
    }
    return _liqPrice;
  }

  function getOpenPrice() {
    let _openPrice;
    if (isLong) {
      _openPrice = parseFloat(openPrice) + parseFloat(openPrice) * parseFloat(spread);
      return _openPrice.toPrecision(6);
    } else {
      _openPrice = parseFloat(openPrice) - parseFloat(openPrice) * parseFloat(spread);
      return _openPrice.toPrecision(6);
    }
  }

  function marginScale(value: number) {
    return Math.round((
      parseInt((Math.ceil(value ** 2 / 100) * 100).toString()) % 1000 === 0
        ? parseInt((Math.ceil(value ** 2 / 100) * 100).toString())
        : value ** 2
      )*100
    )/100;
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
