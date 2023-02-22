import { ErrorOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { useState, useRef, useEffect } from 'react';
import { TigrisInput, TigrisSlider } from '../Input';
import { useAccount, useNetwork } from 'wagmi';
import { eu1oracleSocket, oracleData } from '../../../src/context/socket';
import { IconDropDownMenu } from '../Dropdown/IconDrop';
import { getNetwork } from '../../../src/constants/networks';
import { Contract, ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useApproveToken, useTokenAllowance, useTokenBalance } from 'src/hook/useToken';
import { useOpenInterest } from 'src/hook/useTradeInfo';
import Cookies from 'universal-cookie';

import {
  getShellWallet,
  getShellAddress,
  getShellBalance,
  getShellNonce,
  unlockShellWallet,
  checkShellWallet
} from '../../../src/shell_wallet/index';
import { getProvider, getSigner } from 'src/contracts';

declare const window: any;
const { ethereum } = window;
const cookies = new Cookies();

interface IOrderForm {
  pairIndex: number;
}

export const TradingOrderForm = ({ pairIndex }: IOrderForm) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();
  const [isMarketAvailable, setMarketAvailable] = useState(true);
  const [isMarketClosed, setMarketClosed] = useState(false);
  const { assets } = getNetwork(0);

  useEffect(() => {
    [eu1oracleSocket].forEach((socket) => {
      socket.on('data', (data: any) => {
        if (!data[currentPairIndex.current]) {
          setMarketAvailable(false);
          setOpenPrice('');
          return;
        }
        setMarketAvailable(true);
        setMarketClosed(data[currentPairIndex.current].is_closed);
        if (orderTypeRef.current === 'Market') {
          setOpenPrice((data[currentPairIndex.current].price / 1e18).toString());
          setSpread((data[currentPairIndex.current].spread / 1e10).toPrecision(5));
        }
      });
    });
  }, []);

  useEffect(() => {
    checkShellWallet(address as string);
    getProxyApproval();
  }, [address, chain]);

  useEffect(() => {
    setMarginAssets({ marginAssetDrop: getNetwork(chain?.id).marginAssets });
    const _currentMargin = { marginAssetDrop: getNetwork(chain?.id).marginAssets[1] };
    setCurrentMargin(_currentMargin);
    currentMarginRef.current = _currentMargin;
  }, [chain]);

  const [marginAssets, setMarginAssets] = useState({ marginAssetDrop: getNetwork(chain?.id).marginAssets });

  const [currentMargin, setCurrentMargin] = useState({ marginAssetDrop: getNetwork(chain?.id).marginAssets[1] });
  const currentMarginRef = useRef<any>(getNetwork(chain?.id).marginAssets[1]);

  const currentPairIndex = useRef(pairIndex);

  useEffect(() => {
    currentPairIndex.current = pairIndex;
    try {
      setOpenPrice(((oracleData[currentPairIndex.current] as any).price / 1e18).toPrecision(5));
      setSpread(((oracleData[currentPairIndex.current] as any).spread / 1e10).toPrecision(5));
    } catch {}
  }, [pairIndex]);

  const [isLong, setLong] = useState(true);
  const [openPrice, setOpenPrice] = useState('0');
  const [spread, setSpread] = useState('0.0002');

  const [margin, setMargin] = useState('5');
  const [leverage, setLeverage] = useState('2');

  const [stopLossPrice, setStopLossPrice] = useState('0');
  const [takeProfitPrice, setTakeProfitPrice] = useState('0');
  const [stopLossPercent, setStopLossPercent] = useState('0');
  const [takeProfitPercent, setTakeProfitPercent] = useState('500');

  const [isSlFixed, setSlFixed] = useState(false);
  const [isTpFixed, setTpFixed] = useState(false);

  const [orderType, setOrderType] = useState('Market');

  const [tokenBalance, setTokenBalance] = useState('Loading...');
  const [isBalanceVisible, setBalanceVisible] = useState(true);

  const [isProxyApproved, setIsProxyApproved] = useState(true);
  const [isTokenAllowed, setIsTokenAllowed] = useState(true);
  const [approve] = useApproveToken(currentMargin.marginAssetDrop.address, getNetwork(chain?.id).addresses.trading);

  const tokenLiveBalance = useTokenBalance(currentMargin.marginAssetDrop.address);
  const tokenLiveAllowance = useTokenAllowance(
    currentMargin.marginAssetDrop.address,
    getNetwork(chain?.id).addresses.trading
  );
  useEffect(() => {
    setTokenBalance(
      ((tokenLiveBalance ? Number(tokenLiveBalance) : 0) / 10 ** currentMargin.marginAssetDrop.decimals).toFixed(2)
    );
  }, [tokenLiveBalance, currentMargin]);
  useEffect(() => {
    setIsTokenAllowed(
      currentMargin.marginAssetDrop.address === getNetwork(chain?.id).addresses.tigusd
        ? true
        : tokenLiveAllowance
        ? Number(tokenLiveAllowance) > 0
        : false
    );
  }, [tokenLiveAllowance, currentMargin]);
  const [oi, setOi] = useState<any>({ longOi: 0, shortOi: 0, maxOi: 0 });
  const liveOi = useOpenInterest(pairIndex);
  useEffect(() => {
    setOi(liveOi);
  }, [liveOi]);

  const orderTypeRef = useRef(orderType);
  useEffect(() => {
    orderTypeRef.current = orderType;
  }, [orderType]);

  function handleDirectionChange(value: boolean) {
    setLong(value);
    handleTakeProfitChange({ target: { value: parseFloat(takeProfitPercent) } });
    handleStopLossChange({ target: { value: parseFloat(stopLossPercent) } });
  }

  function handleMarginChange(event: any) {
    setMargin(marginScale(parseFloat(event.target.value)).toString());
  }

  function handleLeverageChange(event: any) {
    setLeverage(event.target.value.toString());
    if (!isTpFixed) {
      handleTakeProfitChange({ target: { value: parseFloat(takeProfitPercent) } });
    } else {
      handleTakeProfitPriceChange(takeProfitPrice);
    }
    if (!isSlFixed) {
      handleStopLossChange({ target: { value: parseFloat(stopLossPercent) } });
    } else {
      handleStopLossPriceChange(stopLossPrice);
    }
  }

  // Slider
  function handleStopLossChange(event: any) {
    setSlFixed(false);
    if (isLong) {
      setStopLossPrice(
        (
          parseFloat(getOpenPrice()) -
          (parseFloat(getOpenPrice()) * (event.target.value / parseFloat(leverage))) / 100
        ).toPrecision(7)
      );
    } else {
      setStopLossPrice(
        (
          parseFloat(getOpenPrice()) +
          (parseFloat(getOpenPrice()) * (event.target.value / parseFloat(leverage))) / 100
        ).toPrecision(7)
      );
    }
    setStopLossPercent(event.target.value.toString());
  }

  // Slider
  function handleTakeProfitChange(event: any) {
    setTpFixed(false);
    if (isLong) {
      setTakeProfitPrice(
        (
          parseFloat(getOpenPrice()) +
          (parseFloat(getOpenPrice()) * (event.target.value / parseFloat(leverage))) / 100
        ).toPrecision(7)
      );
    } else {
      let _tpPrice =
        parseFloat(getOpenPrice()) - (parseFloat(getOpenPrice()) * (event.target.value / parseFloat(leverage))) / 100;
      if (_tpPrice < 0) _tpPrice = 0;
      setTakeProfitPrice(_tpPrice.toPrecision(7));
    }
    setTakeProfitPercent(event.target.value.toString());
  }

  // Input Field
  function handleStopLossPriceChange(value: string) {
    setSlFixed(true);
    setStopLossPrice(value);
    if (isLong) {
      setStopLossPercent(
        ((1 - parseFloat(value) / parseFloat(getOpenPrice())) * 100 * parseFloat(leverage)).toString()
      );
    } else {
      setStopLossPercent(
        ((1 - parseFloat(getOpenPrice()) / parseFloat(value)) * 100 * parseFloat(leverage)).toString()
      );
    }
  }

  // Input Field
  function handleTakeProfitPriceChange(value: string) {
    setTpFixed(true);
    setTakeProfitPrice(value);
    if (isLong) {
      setTakeProfitPercent(
        ((parseFloat(value) / parseFloat(getOpenPrice()) - 1) * 100 * parseFloat(leverage)).toString()
      );
    } else {
      setTakeProfitPercent(
        ((parseFloat(getOpenPrice()) / parseFloat(value) - 1) * 100 * parseFloat(leverage)).toString()
      );
    }
  }

  function handleSetOpenPrice(value: any) {
    if (orderType === 'Market') {
      setOrderType('Limit');
      setOpenPrice(value.slice(0, 7));
    } else {
      setOpenPrice(value);
    }
  }

  const doMarginChange = (prop: string, value: string | number | boolean) => {
    const _currentMargin = { ...currentMargin, [prop]: value };
    setCurrentMargin(_currentMargin);
    currentMarginRef.current = _currentMargin;
    setTokenBalance('Loading...');
  };

  return (
    <Container>
      <FormLabel>Order Form</FormLabel>
      <FormContainer>
        <FormAction>
          <LongButton
            onClick={() => handleDirectionChange(true)}
            sx={{
              backgroundColor: isLong ? '#26a69a' : '#222630',
              color: isLong ? '#FFFFFF' : '#B1B5C3',
              '&:hover': { backgroundColor: isLong ? '#26a69a' : '#222630', color: isLong ? '#FFFFFF' : '#26a69a' }
            }}
          >
            Long
          </LongButton>
          <ShortButton
            onClick={() => handleDirectionChange(false)}
            sx={{
              backgroundColor: isLong ? '#222630' : '#EF5350',
              color: isLong ? '#B1B5C3' : '#FFFFFF',
              '&:hover': { backgroundColor: isLong ? '#222630' : '#EF5350', color: isLong ? '#EF5350' : '#FFFFFF' }
            }}
          >
            Short
          </ShortButton>
        </FormAction>
        <FormAction sx={{ marginTop: '30px' }}>
          <OrderTypeButton
            onClick={() => setOrderType('Market')}
            sx={{
              backgroundColor: orderType === 'Market' ? '#3772ff' : '#222630',
              color: orderType === 'Market' ? '#FFFFFF' : '#B1B5C3',
              '&:hover': {
                backgroundColor: orderType === 'Market' ? '#3772ff' : '#222630',
                color: orderType === 'Market' ? '#FFFFFF' : '#3772ff'
              }
            }}
          >
            Market
          </OrderTypeButton>
          <OrderTypeButton
            onClick={() => {
              setOrderType('Limit');
              setOpenPrice(openPrice.slice(0, 8));
            }}
            sx={{
              backgroundColor: orderType === 'Limit' ? '#3772ff' : '#222630',
              color: orderType === 'Limit' ? '#FFFFFF' : '#B1B5C3',
              '&:hover': {
                backgroundColor: orderType === 'Limit' ? '#3772ff' : '#222630',
                color: orderType === 'Limit' ? '#FFFFFF' : '#3772ff'
              }
            }}
          >
            Limit
          </OrderTypeButton>
          <OrderTypeButton
            onClick={() => {
              setOrderType('Stop');
              setOpenPrice(openPrice.slice(0, 8));
            }}
            sx={{
              backgroundColor: orderType === 'Stop' ? '#3772ff' : '#222630',
              color: orderType === 'Stop' ? '#FFFFFF' : '#B1B5C3',
              '&:hover': {
                backgroundColor: orderType === 'Stop' ? '#3772ff' : '#222630',
                color: orderType === 'Stop' ? '#FFFFFF' : '#3772ff'
              }
            }}
          >
            Stop
          </OrderTypeButton>
        </FormAction>
        <FormArea>
          <TigrisInput
            label="Price"
            placeholder="-"
            value={
              !isMarketAvailable
                ? ''
                : orderType === 'Market'
                ? getOpenPrice().replace('NaN', '-')
                : openPrice.replace('NaN', '-')
            }
            setValue={handleSetOpenPrice}
          />
          <div style={{ cursor: 'not-allowed' }}>
            <div style={{ pointerEvents: 'none' }}>
              <TigrisInput
                label="Liq Price"
                placeholder="-"
                value={!isMarketAvailable ? '' : liqPrice()}
                setValue={() => null}
              />
            </div>
          </div>
          <TigrisInput label="Margin" value={margin} setValue={setMargin} />
          <TigrisInput label="Leverage" value={leverage} setValue={setLeverage} />
          <TigrisSlider // Margin
            defaultValue={Math.sqrt(5)}
            aria-label="Default"
            valueLabelDisplay="auto"
            marks={[
              { value: Math.sqrt(5), label: '5' },
              { value: 100, label: '10k' }
            ]}
            min={Math.sqrt(5)}
            step={0.001}
            max={100}
            scale={(value: number) => marginScale(value)}
            onChange={(event: any) => handleMarginChange(event)}
            value={Math.sqrt(parseFloat(margin))}
          />
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
          <TigrisInput
            label="Stop Loss"
            placeholder={'-'}
            value={
              !isMarketAvailable
                ? ''
                : stopLossPercent === '0'
                ? ''
                : isSlFixed
                ? stopLossPrice
                : getStopLossPrice().replace('NaN', '-')
            }
            setValue={handleStopLossPriceChange}
          />
          <TigrisInput
            label="Take Profit"
            placeholder={'-'}
            value={
              !isMarketAvailable
                ? ''
                : takeProfitPercent === '0'
                ? ''
                : isTpFixed
                ? takeProfitPrice
                : parseFloat(getTakeProfitPrice()) < 0
                ? '0.00000'
                : getTakeProfitPrice().replace('NaN', '-')
            }
            setValue={handleTakeProfitPriceChange}
          />
          <TigrisSlider // Stop Loss
            defaultValue={0}
            aria-label="Default"
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number, index: number) => {
              return `${value}%`;
            }}
            min={0}
            step={1}
            max={90}
            scale={(value) => -value}
            marks={[
              { value: 0, label: '0' },
              { value: 90, label: '-90' }
            ]}
            onChange={(event: any) => handleStopLossChange(event)}
            value={parseFloat(parseFloat(stopLossPercent).toPrecision(4).replace('NaN', '0'))}
          />
          <TigrisSlider // Take profit
            defaultValue={isLong ? 500 : parseFloat(leverage) < 5 ? parseFloat(leverage) * 100 : 500}
            aria-label="Default"
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number, index: number) => {
              return `${value}%`;
            }}
            min={0}
            step={1}
            max={isLong ? 500 : parseFloat(leverage) < 5 ? parseFloat(leverage) * 100 : 500}
            marks={[
              { value: 0, label: '0' },
              {
                value: isLong ? 500 : parseFloat(leverage) < 5 ? parseFloat(leverage) * 100 : 500,
                label: isLong ? 500 : parseFloat(leverage) < 5 ? parseFloat(leverage) * 100 : 500
              }
            ]}
            onChange={(event: any) => handleTakeProfitChange(event)}
            value={parseFloat(parseFloat(takeProfitPercent).toPrecision(4).replace('NaN', '0'))}
          />
          <IconDropDownMenu
            arrayData={marginAssets.marginAssetDrop}
            name="marginAssetDrop"
            state={currentMargin.marginAssetDrop}
            setState={doMarginChange}
          />
          <AssetBalance>
            Balance
            <IconButton onClick={() => setBalanceVisible(!isBalanceVisible)}>
              {isBalanceVisible ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
            </IconButton>
            {isBalanceVisible ? tokenBalance : '• • • • • • •'}
          </AssetBalance>
        </FormArea>
        <ApproveButton onClick={() => routeTrade()} status={getButtonOnline()}>
          {getButtonText()}
        </ApproveButton>
        <Alert>
          {chain === undefined || address === undefined ? (
            <Alert>
              <ErrorOutline sx={{ color: '#EB5757' }} fontSize="small" />
              <AlertContent>Wallet is not connected. Connect your wallet to approve and begin trading.</AlertContent>
            </Alert>
          ) : (
            <></>
          )}
        </Alert>
      </FormContainer>
    </Container>
  );

  function getStopLossPrice() {
    if (stopLossPercent === '0') return '0';
    if (isLong) {
      return (
        parseFloat(getOpenPrice()) -
        (parseFloat(getOpenPrice()) * (parseFloat(stopLossPercent) / parseFloat(leverage))) / 100
      ).toPrecision(7);
    } else {
      return (
        parseFloat(getOpenPrice()) +
        (parseFloat(getOpenPrice()) * (parseFloat(stopLossPercent) / parseFloat(leverage))) / 100
      ).toPrecision(7);
    }
  }

  function getTakeProfitPrice() {
    if (takeProfitPercent === '0') return '0';
    if (isLong) {
      return (
        parseFloat(getOpenPrice()) +
        (parseFloat(getOpenPrice()) * (parseFloat(takeProfitPercent) / parseFloat(leverage))) / 100
      ).toPrecision(7);
    } else {
      return (
        parseFloat(getOpenPrice()) -
        (parseFloat(getOpenPrice()) * (parseFloat(takeProfitPercent) / parseFloat(leverage))) / 100
      ).toPrecision(7);
    }
  }

  function liqPrice() {
    let _liqPrice;
    if (isLong) {
      _liqPrice = (parseFloat(getOpenPrice()) - (parseFloat(getOpenPrice()) * 0.9) / parseFloat(leverage)).toPrecision(
        7
      );
    } else {
      _liqPrice = (parseFloat(getOpenPrice()) + (parseFloat(getOpenPrice()) * 0.9) / parseFloat(leverage)).toPrecision(
        7
      );
    }
    if (_liqPrice === 'NaN') {
      return '-';
    }
    return _liqPrice;
  }

  function getOpenPrice() {
    let _openPrice;
    if (isLong) {
      _openPrice = parseFloat(openPrice) + parseFloat(openPrice) * (orderType === 'Market' ? parseFloat(spread) : 0);
      return _openPrice.toPrecision(7);
    } else {
      _openPrice = parseFloat(openPrice) - parseFloat(openPrice) * (orderType === 'Market' ? parseFloat(spread) : 0);
      return _openPrice.toPrecision(7);
    }
  }

  function marginScale(value: number) {
    return value === Math.sqrt(5)
      ? 5
      : Math.round(
          (parseInt((Math.ceil(value ** 2 / 100) * 100).toString()) % 1000 === 0
            ? parseInt((Math.ceil(value ** 2 / 100) * 100).toString())
            : value ** 2) / 10
        ) * 10;
  }

  /*
  =============
  TRADING LOGIC
  =============
  */

  function getButtonOnline() {
    const s = getTradeStatus();
    const isOnline = s === 'Approve' || s === 'Proxy' || s === 'Ready';
    return isOnline ? 1 : 0;
  }

  function getButtonText() {
    const s = getTradeStatus();
    const txt =
      s === 'Approve'
        ? 'APPROVE ' + currentMargin.marginAssetDrop.name
        : s === 'Proxy'
        ? 'APPROVE PROXY'
        : s === 'Ready'
        ? (isLong ? 'LONG $' : 'SHORT $') +
          Math.round(parseFloat(margin) * parseFloat(leverage))
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
          ' ' +
          assets[pairIndex].name
        : s === 'NotConnected'
        ? 'CONNECT WALLET'
        : s === 'Unavailable'
        ? 'MARKET UNAVAILABLE'
        : s === 'Closed'
        ? 'MARKET CLOSED'
        : s === 'MaxOi'
        ? 'OPEN INTEREST LIMIT REACHED'
        : s === 'Balance'
        ? 'NOT ENOUGH BALANCE'
        : s === 'PosSize'
        ? 'POSITION SIZE TOO LOW'
        : 'You found a bug!';
    return txt;
  }

  function getTradeStatus() {
    let status;
    chain === undefined || address === undefined
      ? (status = 'NotConnected')
      : !isMarketAvailable
      ? (status = 'Unavailable')
      : isMarketClosed
      ? (status = 'Closed')
      : !isTokenAllowed
      ? (status = 'Approve')
      : !isProxyApproved
      ? (status = 'Proxy')
      : parseFloat(margin) > parseFloat(tokenBalance)
      ? (status = 'Balance')
      : oi?.maxOi > 0 &&
        parseFloat(margin) * parseFloat(leverage) + (isLong ? oi?.longOi / 1e18 : oi?.shortOi / 1e18) > oi?.maxOi / 1e18
      ? (status = 'MaxOi')
      : parseFloat(margin) * parseFloat(leverage) < 500
      ? (status = 'PosSize')
      : (status = 'Ready');
    return status;
  }

  function routeTrade() {
    const s = getTradeStatus();
    s === 'NotConnected'
      ? openConnectModal?.()
      : s === 'Approve'
      ? approve?.()
      : s === 'Proxy'
      ? approveProxy()
      : s === 'Ready' && (orderType === 'Market' ? initiateMarketOrder() : initiateLimitOrder());
  }

  async function getTradingContract() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const signer = await getShellWallet();
    return new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, signer);
  }

  function getTradingContractForApprove() {
    let contract: Contract;
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const provider = getProvider();
    if (provider === undefined) return;
    const signer = getSigner();
    if (signer !== null && signer !== undefined) {
      contract = new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, signer);
      return contract;
    }
  }

  async function getProxyApproval() {
    if (!isConnected) return;
    const tradingContract = await getTradingContractForApprove();
    const { minProxyGas } = getNetwork(chain?.id);
    if (tradingContract === undefined) return;
    const proxy = await tradingContract?.proxyApprovals(address);

    const proxyAddress = proxy.proxy;
    const proxyTime = proxy.time;
    const currentTime = Date.now() / 1000;
    const shellBalance = await getShellBalance();

    if (
      (await getShellAddress()).toLowerCase() !== String(proxyAddress).toLowerCase() ||
      currentTime > proxyTime ||
      Number(shellBalance) < minProxyGas
    ) {
      setIsProxyApproved(false);
    } else {
      setIsProxyApproved(true);
    }
  }

  async function approveProxy() {
    const tradingContract = getTradingContractForApprove();
    if (tradingContract === undefined) return;
    const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);
    const traderGas = await tradingContract?.provider.getBalance(address as string);
    const proxyGas = getNetwork(chain?.id).proxyGas;
    if (Number(traderGas) / 1e18 < Number(proxyGas)) {
      toast.error('Not enough gas for proxy wallet');
      return;
    }
    await unlockShellWallet();
    const now = Math.floor(Date.now() / 1000);
    if (tradingContract === undefined) return;
    const tx = tradingContract?.approveProxy(await getShellAddress(), now + 31536000, {
      gasPrice: gasPriceEstimate,
      value: ethers.utils.parseEther(proxyGas)
    });
    const response: any = await toast.promise(tx, {
      pending: 'Proxy approval pending...',
      success: undefined,
      error: 'Proxy approval failed!'
    });
    // eslint-disable-next-line
    setTimeout(async () => {
      if (tradingContract === undefined) return;
      const receipt = await tradingContract?.provider.getTransactionReceipt(response.hash);
      if (receipt.status === 0) {
        toast.error('Proxy approval failed!');
      } else if (receipt.status === 1) {
        toast.success('Successfully approved proxy!');
      }
      getProxyApproval();
    }, 2000);
  }

  async function initiateMarketOrder() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);

    const _margin = ethers.utils.parseEther(margin);
    const _leverage = ethers.utils.parseEther(leverage);

    let _tp: any = ethers.utils.parseEther(getTakeProfitPrice());
    if (parseFloat(_tp.toString()) < 0) {
      _tp = 0;
    }
    const _sl = ethers.utils.parseEther(getStopLossPrice());

    const _ref = cookies.get('ref') ? cookies.get('ref') : ethers.constants.AddressZero;

    const _tradeInfo = [
      _margin,
      currentMargin.marginAssetDrop.address,
      currentMargin.marginAssetDrop.stablevault,
      _leverage,
      pairIndex,
      isLong,
      _tp,
      _sl,
      _ref
    ];

    try {
      const _oracleData: any = oracleData[pairIndex];

      const _priceData = [
        _oracleData.provider,
        _oracleData.is_closed,
        pairIndex,
        _oracleData.price,
        _oracleData.spread,
        _oracleData.timestamp
      ];

      if (isLong && parseInt(_sl.toString()) > parseInt(_oracleData.price) && parseInt(_sl.toString()) !== 0) {
        toast.warn('Stop loss too high');
        return;
      } else if (!isLong && parseInt(_sl.toString()) < parseInt(_oracleData.price) && parseInt(_sl.toString()) !== 0) {
        toast.warn('Stop loss too low');
        return;
      }

      try {
        const tradingContract = await getTradingContract();
        const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);

        const tx = tradingContract.initiateMarketOrder(
          _tradeInfo,
          _priceData,
          _oracleData.signature,
          [0, 0, 0, ethers.constants.HashZero, ethers.constants.HashZero, false],
          address,
          { gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0, nonce: await getShellNonce() }
        );
        const response: any = await toast.promise(tx, {
          pending: 'Opening market position...',
          success: undefined,
          error: 'Opening position failed!'
        });
        // eslint-disable-next-line
        setTimeout(async () => {
          const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
          if (receipt.status === 0) {
            toast.error('Opening position failed!');
          }
        }, 1000);
      } catch (err: any) {
        console.log(err);
      }
    } catch (err: any) {
      console.log(err);
    }
  }

  async function initiateLimitOrder() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);

    const _margin = ethers.utils.parseEther(margin);
    const _leverage = ethers.utils.parseEther(leverage);
    const _openPrice = ethers.utils.parseEther(openPrice);

    let _tp: any = ethers.utils.parseEther(getTakeProfitPrice());
    if (parseFloat(_tp.toString()) < 0) {
      _tp = 0;
    }
    const _sl = ethers.utils.parseEther(getStopLossPrice());

    const _ref = cookies.get('ref') ? cookies.get('ref') : ethers.constants.AddressZero;

    const _tradeInfo = [
      _margin,
      currentMargin.marginAssetDrop.address,
      currentMargin.marginAssetDrop.stablevault,
      _leverage,
      pairIndex,
      isLong,
      _tp,
      _sl,
      _ref
    ];

    try {
      if (isLong && parseInt(_sl.toString()) > parseInt(_openPrice.toString()) && parseInt(_sl.toString()) !== 0) {
        toast.warn('Stop loss too high');
        return;
      } else if (
        !isLong &&
        parseInt(_sl.toString()) < parseInt(_openPrice.toString()) &&
        parseInt(_sl.toString()) !== 0
      ) {
        toast.warn('Stop loss too low');
        return;
      }

      try {
        const tradingContract = await getTradingContract();
        const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);

        const tx = tradingContract.initiateLimitOrder(
          _tradeInfo,
          orderType === 'Limit' ? 1 : 2,
          _openPrice,
          [0, 0, 0, ethers.constants.HashZero, ethers.constants.HashZero, false],
          address,
          { gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0, nonce: await getShellNonce() }
        );
        const response: any = await toast.promise(tx, {
          pending: orderType === 'Limit' ? 'Creating limit order...' : 'Creating stop order...',
          success: undefined,
          error: orderType === 'Limit' ? 'Creating limit order failed!' : 'Creating stop order failed!'
        });
        // eslint-disable-next-line
        setTimeout(async () => {
          const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
          if (receipt.status === 0) {
            toast.error(orderType === 'Limit' ? 'Creating limit order failed!' : 'Creating stop order failed!');
          }
        }, 1000);
      } catch (err: any) {
        console.log(err);
      }
    } catch (err: any) {
      console.log(err);
    }
  }
};

const Container = styled(Box)(({ theme }) => ({
  maxWidth: '100%',
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
  lineHeight: '15px',
  letterSpacing: '0.1em',
  fontWeight: 700,
  borderBottom: '5px solid #141416'
}));

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: '#18191D',
  marginRight: '5px',
  paddingTop: '20px',
  paddingRight: '20px',
  paddingLeft: '20px',
  paddingBottom: '10px'
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
  gap: '5%'
}));

interface IApproveButton {
  status: number;
}
const ApproveButton = styled(Button)(({ status }: IApproveButton) => ({
  marginTop: '17px',
  borderRadius: '0px',
  width: '100%',
  textTransform: 'none',
  backgroundColor: status === 1 ? '#3772FF' : '#2F3135',
  '&:hover': {
    backgroundColor: status === 1 ? '#3772FF' : '#2F3135'
  }
}));

const Alert = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  marginTop: '10px'
}));

const AlertContent = styled(Box)(({ theme }) => ({
  fontSize: '11px',
  lineHeight: '20px',
  color: 'rgba(177, 181, 195, 0.5)'
}));
