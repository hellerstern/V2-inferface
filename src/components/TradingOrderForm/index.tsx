import { ErrorOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { useState, useRef, useEffect } from 'react';
import { TigrisInput, TigrisSlider } from '../Input';
import { useAccount, useNetwork } from 'wagmi';
import { oracleSocket, oracleData } from '../../../src/context/socket';
import { IconDropDownMenu } from '../Dropdown/IconDrop';
import { getNetwork } from "../../../src/constants/networks";
import { ethers } from 'ethers';
import socketio from "socket.io-client";
import { toast } from 'react-toastify';

import { getShellWallet, getShellAddress, getShellBalance, getShellNonce, unlockShellWallet } from '../../../src/shell_wallet/index';

declare const window: any
const { ethereum } = window;

interface IOrderForm {
  pairIndex: number;
}

export const TradingOrderForm = ({ pairIndex }: IOrderForm) => {

  const { address } = useAccount();
  const { chain } = useNetwork();

  // First render
  useEffect(() => {
    oracleSocket.on('data', (data: any) => {
      if (orderTypeRef.current === "Market") {
        setOpenPrice((data[currentPairIndex.current].price / 1e18).toString());
        setSpread((data[currentPairIndex.current].spread / 1e10).toPrecision(5));
      }
    });
    getTokenApproval();
    getTokenBalance();
  }, []);

  useEffect(() => {
    getProxyApproval();
  }, [chain, address, ethereum]);

  useEffect(() => {
    if (address === undefined) return;
    const x = async () => {
      await unlockShellWallet();
    }
    x();
  }, [address]);

  useEffect(() => {
    setMarginAssets({ marginAssetDrop: getNetwork(chain === undefined ? 0 : chain.id).marginAssets });
    const _currentMargin = { marginAssetDrop: getNetwork(chain === undefined ? 0 : chain.id).marginAssets[0] };
    setCurrentMargin(_currentMargin);
    currentMarginRef.current = _currentMargin;
  }, [chain]);

  const [marginAssets, setMarginAssets] = useState({ marginAssetDrop: getNetwork(chain === undefined ? 0 : chain.id).marginAssets });

  const [currentMargin, setCurrentMargin] = useState({ marginAssetDrop: getNetwork(chain === undefined ? 0 : chain.id).marginAssets[0] });

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

  const [tokenBalance, setTokenBalance] = useState("Loading...");
  const [isBalanceVisible, setBalanceVisible] = useState(true);

  const [isProxyApproved, setIsProxyApproved] = useState(true);
  const [isTokenAllowed, setIsTokenAllowed] = useState(true);

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
    setLeverage((event.target.value).toString());
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
      setStopLossPrice((parseFloat(getOpenPrice()) - parseFloat(getOpenPrice()) * (event.target.value / parseFloat(leverage)) / 100).toPrecision(7));
    } else {
      setStopLossPrice((parseFloat(getOpenPrice()) + parseFloat(getOpenPrice()) * (event.target.value / parseFloat(leverage)) / 100).toPrecision(7));
    }
    setStopLossPercent(event.target.value.toString());
  }

  // Slider
  function handleTakeProfitChange(event: any) {
    setTpFixed(false);
    if (isLong) {
      setTakeProfitPrice((parseFloat(getOpenPrice()) + parseFloat(getOpenPrice()) * (event.target.value / parseFloat(leverage)) / 100).toPrecision(7));
    } else {
      let _tpPrice = (parseFloat(getOpenPrice()) - parseFloat(getOpenPrice()) * (event.target.value / parseFloat(leverage)) / 100);
      if (_tpPrice < 0) _tpPrice = 0;
      setTakeProfitPrice(_tpPrice.toPrecision(7))
    }
    setTakeProfitPercent(event.target.value.toString());
  }

  // Input Field
  function handleStopLossPriceChange(value: string) {
    setSlFixed(true);
    setStopLossPrice(value);
    if (isLong) {
      setStopLossPercent(((1 - parseFloat(value) / parseFloat(getOpenPrice())) * 100 * parseFloat(leverage)).toString());
    } else {
      setStopLossPercent(((1 - parseFloat(getOpenPrice()) / parseFloat(value)) * 100 * parseFloat(leverage)).toString());
    }
  }

  // Input Field
  function handleTakeProfitPriceChange(value: string) {
    setTpFixed(true);
    setTakeProfitPrice(value);
    if (isLong) {
      setTakeProfitPercent(((parseFloat(value) / parseFloat(getOpenPrice()) - 1) * 100 * parseFloat(leverage)).toString());
    } else {
      setTakeProfitPercent(((parseFloat(getOpenPrice()) / parseFloat(value) - 1) * 100 * parseFloat(leverage)).toString());
    }
  }

  function handleSetOpenPrice(value: any) {
    if (orderType === "Market") {
      setOrderType("Limit");
      setOpenPrice(value.slice(0, 7));
    } else {
      setOpenPrice(value);
      console.log(value);
    }
  }

  const currentMarginRef = useRef<any>(null);

  const doMarginChange = (prop: string, value: string | number | boolean) => {
    const _currentMargin = { ...currentMargin, [prop]: value };
    setCurrentMargin(_currentMargin);
    currentMarginRef.current = _currentMargin;
    setTokenBalance("Loading...");
    getTokenApproval();
  };

  useEffect(() => {
    getTokenBalance();
  }, [currentMargin, address, chain]);

  useEffect(() => {
    if (address !== undefined) {
      const socket = socketio('https://trading-events-zcxv7.ondigitalocean.app/', { transports: ['websocket'] });

      socket.on('PositionOpened', (data: any) => {
        if (data.trader === address && data.chainId === chain?.id) {
          getTokenBalance();
          getProxyApproval();
        }
      });

      socket.on('PositionClosed', (data: any) => {
        if (data.trader === address && data.chainId === chain?.id) {
          getTokenBalance();
          getProxyApproval();
        }
      });

      socket.on('LimitCancelled', (data: any) => {
        if (data.trader === address && data.chainId === chain?.id) {
          getTokenBalance();
          getProxyApproval();
        }
      });

      socket.on('MarginModified', (data: any) => {
        if (data.trader === address && data.chainId === chain?.id) {
          getTokenBalance();
          getProxyApproval();
        }
      });

      socket.on('AddToPosition', (data: any) => {
        if (data.trader === address && data.chainId === chain?.id) {
          getTokenBalance();
          getProxyApproval();
        }
      });

      return () => {
        socket.disconnect();
      }
    }
  }, [address, chain, currentMargin]);

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
        <FormAction sx={{ marginTop: '30px' }}>
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
            orderType === "Market" ? getOpenPrice().replace("NaN", "") : openPrice.replace("NaN", "")
          } setValue={
            handleSetOpenPrice
          } />
          <div style={{ cursor: 'not-allowed' }}>
            <div style={{ pointerEvents: 'none' }}>
              <TigrisInput label="Liq Price" value={liqPrice()} setValue={() => null} />
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
            scale={(value: number) =>
              marginScale(value)
            }
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
            defaultValue={isLong ? 500 : parseFloat(leverage) < 5 ? parseFloat(leverage) * 100 : 500}
            aria-label="Default"
            valueLabelDisplay="auto"
            min={0}
            step={1}
            max={isLong ? 500 : parseFloat(leverage) < 5 ? parseFloat(leverage) * 100 : 500}
            marks={[
              { value: 0, label: '0' },
              { value: isLong ? 500 : parseFloat(leverage) < 5 ? parseFloat(leverage) * 100 : 500, label: isLong ? 500 : parseFloat(leverage) < 5 ? parseFloat(leverage) * 100 : 500 }
            ]}
            onChange={(event: any) => handleTakeProfitChange(event)}
            value={parseFloat(parseFloat(takeProfitPercent).toPrecision(4))}
          />
          <IconDropDownMenu
            arrayData={marginAssets.marginAssetDrop}
            name="marginAssetDrop"
            state={currentMargin.marginAssetDrop}
            setState={doMarginChange}
          />
          <AssetBalance key={tokenBalance}>
            Balance
            <IconButton onClick={() => setBalanceVisible(!isBalanceVisible)}>
              {isBalanceVisible ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
            </IconButton>
            {isBalanceVisible ? tokenBalance : '• • • • • • •'}
          </AssetBalance>
        </FormArea>
        <ApproveButton onClick={() => getButtonOnline() ? routeTrade() : null} isOnline={getButtonOnline()}>{getButtonText()}</ApproveButton>
        <Alert>
          {
            chain === undefined || address === undefined ?
              <Alert>
                <ErrorOutline sx={{ color: '#EB5757' }} fontSize="small" />
                <AlertContent>
                  Wallet is not connected. Connect your wallet to be able approve and trade.
                </AlertContent>
              </Alert>
              :
              <></>
          }
        </Alert>
      </FormContainer>
    </Container>
  );

  function getStopLossPrice() {
    if (stopLossPercent === "0") return "0";
    if (isLong) {
      return (parseFloat(getOpenPrice()) - parseFloat(getOpenPrice()) * (parseFloat(stopLossPercent) / parseFloat(leverage)) / 100).toPrecision(7);
    } else {
      return (parseFloat(getOpenPrice()) + parseFloat(getOpenPrice()) * (parseFloat(stopLossPercent) / parseFloat(leverage)) / 100).toPrecision(7);
    }
  }

  function getTakeProfitPrice() {
    if (takeProfitPercent === "0") return "0";
    if (isLong) {
      return (parseFloat(getOpenPrice()) + parseFloat(getOpenPrice()) * (parseFloat(takeProfitPercent) / parseFloat(leverage)) / 100).toPrecision(7);
    } else {
      return (parseFloat(getOpenPrice()) - parseFloat(getOpenPrice()) * (parseFloat(takeProfitPercent) / parseFloat(leverage)) / 100).toPrecision(7);
    }
  }

  function liqPrice() {
    let _liqPrice;
    if (isLong) {
      _liqPrice = (parseFloat(getOpenPrice()) - parseFloat(getOpenPrice()) * 0.9 / parseFloat(leverage)).toPrecision(7);
    } else {
      _liqPrice = (parseFloat(getOpenPrice()) + parseFloat(getOpenPrice()) * 0.9 / parseFloat(leverage)).toPrecision(7);
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
      return _openPrice.toPrecision(7);
    } else {
      _openPrice = parseFloat(openPrice) - parseFloat(openPrice) * parseFloat(spread);
      return _openPrice.toPrecision(7);
    }
  }

  async function getTokenBalance() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const provider = new ethers.providers.Web3Provider(ethereum);
    const tokenContract = new ethers.Contract(currentMargin.marginAssetDrop.address, currentNetwork.abis.erc20, provider);
    const balance = ((await tokenContract.balanceOf(address)) / 10 ** (currentMargin.marginAssetDrop.decimals)).toFixed(2);
    setTokenBalance(balance);
  }

  function marginScale(value: number) {
    return Math.round((
      parseInt((Math.ceil(value ** 2 / 100) * 100).toString()) % 1000 === 0
        ? parseInt((Math.ceil(value ** 2 / 100) * 100).toString())
        : value ** 2
    ) / 10
    ) * 10;
  }

  /*
  =============
  TRADING LOGIC
  =============
  */

  function getButtonOnline() {
    const s = getTradeStatus();
    const isOnline =
      s === "Approve" ||
      s === "Proxy" ||
      s === "Ready"
      ;
    return isOnline;
  }

  function getButtonText() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const s = getTradeStatus();
    const txt =
      s === "Approve" ? "APPROVE " + currentMargin.marginAssetDrop.name :
        s === "Proxy" ? "APPROVE PROXY" :
          s === "Ready" ? (isLong ? "LONG $" : "SHORT $") + Math.round(parseFloat(margin) * parseFloat(leverage)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + (currentNetwork.assets[pairIndex].name) :
            s === "NotConnected" ? "CONNECT WALLET" :
              s === "Balance" ? "NOT ENOUGH BALANCE" :
                s === "PosSize" ? "POSITION SIZE TOO LOW" :
                  "You found a bug!"
    ;
    return txt;
  }

  function getTradeStatus() {
    let status;
    !isTokenAllowed ? status = "Approve" :
      !isProxyApproved ? status = "Proxy" :
        parseFloat(margin) > parseFloat(tokenBalance) ? status = "Balance" :
          parseFloat(margin)*parseFloat(leverage) < 500 ? status = "PosSize" :
            (chain === undefined || address === undefined) ? status = "NotConnected" :
              status = "Ready";
    return status;
  }

  function routeTrade() {
    const s = getTradeStatus();
    s === "Approve" ? approveToken() :
      s === "Proxy" ? approveProxy() :
        s === "Ready" ? initiateMarketOrder() :
          console.log("Oops");
  }

  // TODO TOASTS
  async function getTradingContract() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const signer = await getShellWallet();
    return new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, signer);
  }

  function getTradingContractForApprove() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, signer);
  }

  async function getProxyApproval() {
    const tradingContract = await getTradingContract();

    const proxy = await tradingContract.proxyApprovals(address);

    const proxyAddress = proxy.proxy;
    const proxyTime = proxy.time;
    const currentTime = Date.now() / 1000;
    const shellBalance = await getShellBalance();

    if ((await getShellAddress()).toLowerCase() !== String(proxyAddress).toLowerCase() || currentTime > proxyTime || Number(shellBalance) < 0.002) {
      setIsProxyApproved(false);
    } else {
      setIsProxyApproved(true);
    }
  }

  async function approveProxy() {
    const tradingContract = getTradingContractForApprove();
    const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);

    const now = Math.floor(Date.now() / 1000);
    const tx = tradingContract.approveProxy(await getShellAddress(), now + 86400, { gasPrice: gasPriceEstimate, value: ethers.utils.parseEther("0.005") });
    const response: any = await toast.promise(
      tx,
      {
        pending: 'Proxy approval pending...',
        success: undefined,
        error: 'Proxy approval failed!'
      }
    );
    // eslint-disable-next-line
    setTimeout(async () => {
      const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
      if (receipt.status === 0) {
        toast.error(
          'Proxy approval failed!'
        );
      } else if(receipt.status === 1) {
        toast.success(
          'Successfully approved proxy!'
        );    
      }
      getProxyApproval();
    }, 2000);
  }

  async function getTokenApproval() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    if (currentMarginRef.current !== null && currentMarginRef.current.marginAssetDrop.address === currentNetwork.addresses.tigusd) {
      setIsTokenAllowed(true);
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const tokenContract = new ethers.Contract(currentMarginRef.current.marginAssetDrop.address, currentNetwork.abis.erc20, provider);
    const allowance = await tokenContract.allowance(address, currentNetwork.addresses.trading);
    if ((allowance.toString()) !== "0") {
      setIsTokenAllowed(true);
    } else {
      setIsTokenAllowed(false);
    }
  }

  async function approveToken() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(currentMargin.marginAssetDrop.address, currentNetwork.abis.erc20, signer);
    const tx = tokenContract.approve(currentNetwork.addresses.trading, ethers.constants.MaxUint256);
    const response: any = await toast.promise(
      tx,
      {
        pending: 'Approval pending...',
        success: undefined,
        error: 'Approval failed!'
      }
    );
    // eslint-disable-next-line
    setTimeout(async () => {
      const receipt = await tokenContract.provider.getTransactionReceipt(response.hash);
      if (receipt.status === 0) {
        toast.error(
          'Approval failed!'
        );
      } else if(receipt.status === 1) {
        toast.success(
          'Successfully approved!'
        );    
      }
      getTokenApproval();
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

    // TODO referral cookie
    const _ref = ethers.constants.HashZero;

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
        pairIndex,
        _oracleData.price,
        _oracleData.spread,
        _oracleData.timestamp,
        _oracleData.isClosed
      ];

      if (isLong && parseInt(_sl.toString()) > parseInt(_oracleData.price) && parseInt(_sl.toString()) !== 0) {
        toast.warn(
          "Stop loss too high"
        );
        return;
      } else if (!isLong && parseInt(_sl.toString()) < parseInt(_oracleData.price) && parseInt(_sl.toString()) !== 0) {
        toast.warn(
          "Stop loss too low"
        );
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
        const response: any = await toast.promise(
          tx,
          {
            pending: 'Opening market position...',
            success: undefined,
            error: 'Opening position failed!'
          }
        );
        // eslint-disable-next-line
        setTimeout(async () => {
          const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
          if (receipt.status === 0) {
            toast.error(
              'Opening position failed!'
            );
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
  gap: '5%'
}));

interface IApproveButton {
  isOnline: boolean
}
const ApproveButton = styled(Button)(({ isOnline }: IApproveButton) => ({
  marginTop: '17px',
  borderRadius: '0px',
  width: '100%',
  textTransform: 'none',
  backgroundColor: (isOnline ? '#3772FF' : '#2F3135'),
  '&:hover': {
    backgroundColor: (isOnline ? '#3772FF' : '#2F3135')
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
