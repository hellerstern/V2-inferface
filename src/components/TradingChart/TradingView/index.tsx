/* eslint-disable */
import { useRef } from 'react';
import './src/index.css';
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  IChartWidgetApi,
  IOrderLineAdapter
} from '../../../charting_library';
import Datafeed from './datafeed.js';
import { useEffect } from 'react';
import { getNetwork } from '../../../constants/networks/index';
import { oracleSocket1 } from '../../../../src/context/socket';
import { toast } from 'react-toastify';
import { getShellWallet, getShellNonce } from '../../../../src/shell_wallet/index';
import { oracleData } from 'src/context/socket';
import { useAccount, useNetwork } from 'wagmi';
import { ethers } from 'ethers';
import { Timezone } from 'src/charting_library/datafeed-api';

export interface ChartContainerProps {
  asset: any;
  positionData: any;
}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? null : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

export const TVChartContainer = ({ asset, positionData }: ChartContainerProps) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { assets } = getNetwork(0);

  const posData = positionData;

  const widgetOptions: ChartingLibraryWidgetOptions = {
    symbol: assets[asset].name as string,
    // tslint:disable-next-line:no-any
    datafeed: Datafeed,
    interval: '1' as ResolutionString,
    container: 'tv_chart_container',
    library_path: '/charting_library/' as string,

    locale: getLanguageFromURL() || 'en',
    disabled_features: ['header_symbol_search', 'header_compare', 'use_localstorage_for_settings', 'header_settings'],
    enabled_features: ['study_template'],
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studies_overrides: {},
    theme: 'Dark',
    overrides: {
      'paneProperties.background': '#17191D',
      'paneProperties.backgroundType': 'solid',
      'scalesProperties.showSymbolLabels': false,
      rightOffset: 10
    },
    custom_css_url: 'css/style.css',
    toolbar_bg: '#17191D',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
    loading_screen: { backgroundColor: '#17191D' },
    drawings_access: {
      type: 'black',
      tools: [
        {
          name: 'Font Icons',
          grayed: false
        }
      ]
    }
  };
  const tvWidget = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('LastPairSelected', asset);
    let _widget = new widget(widgetOptions);
    tvWidget.current = _widget;
    _widget.onChartReady(() => {
      _widget.chart().setVisibleRange({ from: Date.now() / 1000 - 7500, to: Date.now() / 1000 + 1000 });
    });
  }, []);

  useEffect(() => {
    currentAsset.current = asset;
    localStorage.setItem('LastPairSelected', asset);
    try {
      tvWidget.current?.setSymbol(
        assets[asset].name as string,
        tvWidget.current?.symbolInterval().interval as ResolutionString,
        () => {}
      );
    } catch {
      tvWidget.current = new widget(widgetOptions);
    }
  }, [asset]);

  const BidLine = useRef<any>(null);
  const AskLine = useRef<any>(null);
  const currentAsset = useRef<any>(null);

  useEffect(() => {
    tvWidget.current.onChartReady(() => {
      [oracleSocket1].forEach((socket) => {
        socket.on('data', (data: any) => {
          if (!data[currentAsset.current]) return;
          const spreadPrices = {
            ask:
              (parseInt(data[currentAsset.current].price) -
                (parseInt(data[currentAsset.current].price) * parseInt(data[currentAsset.current].spread)) / 1e10) /
              1e18,
            bid:
              (parseInt(data[currentAsset.current].price) +
                (parseInt(data[currentAsset.current].price) * parseInt(data[currentAsset.current].spread)) / 1e10) /
              1e18
          };
          try {
            (tvWidget.current.chart() as IChartWidgetApi).removeEntity(BidLine.current);
            (tvWidget.current.chart() as IChartWidgetApi).removeEntity(AskLine.current);
            BidLine.current = (tvWidget.current.chart() as IChartWidgetApi).createShape(
              {
                time: 0,
                price: spreadPrices.bid
              },
              {
                shape: 'horizontal_line',
                lock: true,
                disableSelection: true,
                overrides: {
                  showPrice: true,
                  linestyle: 1,
                  linewidth: 1,
                  linecolor: '#26A69A',
                  showLabel: true,
                  text: 'ASK',
                  textcolor: '#26A69A',
                  horzLabelsAlign: 'right',
                  vertLabelsAlign: 'bottom',
                  fontsize: '11'
                }
              }
            );
            AskLine.current = (tvWidget.current.chart() as IChartWidgetApi).createShape(
              {
                time: 0,
                price: spreadPrices.ask
              },
              {
                shape: 'horizontal_line',
                lock: true,
                disableSelection: true,
                overrides: {
                  showPrice: true,
                  linestyle: 1,
                  linewidth: 1,
                  linecolor: '#EF534F',
                  showLabel: true,
                  text: 'BID',
                  textcolor: '#EF534F',
                  horzLabelsAlign: 'right',
                  vertLabelsAlign: 'top',
                  fontsize: '11'
                }
              }
            );
          } catch (err) {}
        });
      });
    });
  }, []);

  const posLines = useRef<any[]>([]);
  useEffect(() => {
    tvWidget.current.onChartReady(() => {
      posLines.current.forEach((line) => {
        try {
          line.remove();
          posLines.current = [];
        } catch (err) {
          console.log(err);
        }
      });
      const data = positionData.openPositions.concat(positionData.limitOrders);
      for (let i = 0; i < data.length; i++) {
        if (data[i].asset === asset && data[i].isVisible) {
          try {
            if (parseFloat(data[i].price) !== 0) {
              const line = (tvWidget.current.chart() as IChartWidgetApi)
                .createOrderLine({
                  disableUndo: true
                })
                .setText(
                  (parseFloat(data[i].leverage) / 1e18).toFixed(0) +
                    'X' +
                    (data[i].orderType === 0 ? ' ' : data[i].orderType === 1 ? ' LIMIT ' : ' STOP ') +
                    (data[i].direction ? 'LONG' : 'SHORT')
                )
                .setPrice(parseFloat(data[i].price) / 1e18)
                .setQuantity('')
                .setLineStyle(0)
                .setEditable(false)
                .setLineColor(data[i].orderType === 0 ? '#FFFFFF' : '#3c83ff')
                .setBodyBorderColor('rgba(0,0,0,0)')
                .setBodyBackgroundColor('rgba(0,0,0,0)')
                .setQuantityBorderColor('rgba(0,0,0,0)')
                .setQuantityBackgroundColor('rgba(0,0,0,0)')
                .setCancelButtonBorderColor('rgba(0,0,0,0)')
                .setCancelButtonBackgroundColor('rgba(0,0,0,0)')
                .setBodyTextColor(data[i].orderType === 0 ? '#FFFFFF' : '#3c83ff')
                .setQuantityTextColor('#FFFFFF')
                .setCancelButtonIconColor('rgba(0,0,0,0)')
                .setQuantityFont('400 13pt DM Sans')
                .setBodyFont('400 13pt DM Sans');
              posLines.current.push(line);
            }
            if (parseFloat(data[i].slPrice) !== 0 && data[i].orderType === 0) {
              const line = (tvWidget.current.chart() as IChartWidgetApi)
                .createOrderLine({
                  disableUndo: true
                })
                .onMove(() => {
                  updateTPSL(data[i], false, line);
                })
                .setText(
                  (parseFloat(data[i].leverage) / 1e18).toFixed(0) +
                    'X' +
                    (data[i].orderType === 0 ? ' ' : data[i].orderType === 1 ? ' LIMIT ' : ' STOP ') +
                    (data[i].direction ? 'LONG ' : 'SHORT') +
                    ' STOP LOSS'
                )
                .setPrice(parseFloat(data[i].slPrice) / 1e18)
                .setQuantity(data[i].orderType === 0 ? '' : '🔒')
                .setLineStyle(2)
                .setEditable(data[i].orderType === 0)
                .setLineColor('#EF534F')
                .setBodyBorderColor('rgba(0,0,0,0)')
                .setBodyBackgroundColor('rgba(0,0,0,0)')
                .setQuantityBorderColor('rgba(0,0,0,0)')
                .setQuantityBackgroundColor('rgba(0,0,0,0)')
                .setCancelButtonBorderColor('rgba(0,0,0,0)')
                .setCancelButtonBackgroundColor('rgba(0,0,0,0)')
                .setBodyTextColor('#EF534F')
                .setTooltip('Drag to edit stop loss')
                .setQuantityTextColor('#EF534F')
                .setCancelButtonIconColor('rgba(0,0,0,0)')
                .setQuantityFont('400 13pt DM Sans')
                .setBodyFont('400 13pt DM Sans');
              posLines.current.push(line);
            }
            if (parseFloat(data[i].tpPrice) !== 0 && data[i].orderType === 0) {
              const line = (tvWidget.current.chart() as IChartWidgetApi)
                .createOrderLine({
                  disableUndo: true
                })
                .onMove(() => {
                  updateTPSL(data[i], true, line);
                })
                .setText(
                  (parseFloat(data[i].leverage) / 1e18).toFixed(0) +
                    'X' +
                    (data[i].orderType === 0 ? ' ' : data[i].orderType === 1 ? ' LIMIT ' : ' STOP ') +
                    (data[i].direction ? 'LONG ' : 'SHORT') +
                    ' TAKE PROFIT'
                )
                .setPrice(parseFloat(data[i].tpPrice) / 1e18)
                .setQuantity(data[i].orderType === 0 ? '' : '🔒')
                .setLineStyle(2)
                .setEditable(data[i].orderType === 0)
                .setLineColor('#26A69A')
                .setBodyBorderColor('rgba(0,0,0,0)')
                .setBodyBackgroundColor('rgba(0,0,0,0)')
                .setQuantityBorderColor('rgba(0,0,0,0)')
                .setQuantityBackgroundColor('rgba(0,0,0,0)')
                .setCancelButtonBorderColor('rgba(0,0,0,0)')
                .setCancelButtonBackgroundColor('rgba(0,0,0,0)')
                .setBodyTextColor('#26A69A')
                .setTooltip('Drag to edit take profit')
                .setQuantityTextColor('#26A69A')
                .setCancelButtonIconColor('rgba(0,0,0,0)')
                .setQuantityFont('400 13pt DM Sans')
                .setBodyFont('400 13pt DM Sans');
              posLines.current.push(line);
            }
            if (parseFloat(data[i].liqPrice) !== 0 && data[i].orderType === 0) {
              const line = (tvWidget.current.chart() as IChartWidgetApi)
                .createOrderLine({
                  disableUndo: true
                })
                .onMove(() => {
                  modifyMargin(data[i], line);
                })
                .setText(
                  (parseFloat(data[i].leverage) / 1e18).toFixed(0) +
                    'X' +
                    (data[i].orderType === 0 ? ' ' : data[i].orderType === 1 ? ' LIMIT ' : ' STOP ') +
                    (data[i].direction ? 'LONG ' : 'SHORT') +
                    ' LIQUIDATION'
                )
                .setPrice(parseFloat(data[i].liqPrice) / 1e18)
                .setQuantity(data[i].orderType === 0 ? '' : '🔒')
                .setLineStyle(0)
                .setEditable(data[i].orderType === 0)
                .setLineColor('#FFFF00')
                .setBodyBorderColor('rgba(0,0,0,0)')
                .setBodyBackgroundColor('rgba(0,0,0,0)')
                .setQuantityBorderColor('rgba(0,0,0,0)')
                .setQuantityBackgroundColor('rgba(0,0,0,0)')
                .setCancelButtonBorderColor('rgba(0,0,0,0)')
                .setCancelButtonBackgroundColor('rgba(0,0,0,0)')
                .setBodyTextColor('#FFFF00')
                .setTooltip('Drag to add/remove margin')
                .setQuantityTextColor('#FFFF00')
                .setCancelButtonIconColor('rgba(0,0,0,0)')
                .setQuantityFont('400 13pt DM Sans')
                .setBodyFont('400 13pt DM Sans');
              posLines.current.push(line);
            }
          } catch {}
        }
      }
    });
  }, [posData, asset]);

  // Trade functions
  async function getTradingContract() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const shellWalletSigner = await getShellWallet();
    return new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, shellWalletSigner);
  }
  async function updateTPSL(position: any, isTP: boolean, line: IOrderLineAdapter) {
    try {
      const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
      const _oracleData: any = oracleData[asset];
      const tradingContract = await getTradingContract();
      const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);
      const price = ethers.utils.parseEther(line.getPrice().toString());

      if (isTP) {
        if (position.direction) {
          if (parseFloat(price.toString()) < parseFloat(_oracleData.price) && parseFloat(price.toString()) !== 0) {
            toast.warning('Take profit too low');
            line.setPrice(parseFloat(position.tpPrice) / 1e18);
            return;
          }
        } else {
          if (parseFloat(price.toString()) > parseFloat(_oracleData.price) && parseFloat(price.toString()) !== 0) {
            toast.warning('Take profit too high');
            line.setPrice(parseFloat(position.tpPrice) / 1e18);
            return;
          }
        }
      } else {
        if (position.direction) {
          if (parseFloat(price.toString()) > parseFloat(_oracleData.price) && parseFloat(price.toString()) !== 0) {
            toast.warning('Stop loss too high');
            line.setPrice(parseFloat(position.slPrice) / 1e18);
            return;
          }
          if (parseFloat(price.toString()) < parseFloat(position.liqPrice) && parseFloat(price.toString()) !== 0) {
            toast.warning('Stop loss past liquidation price!');
            line.setPrice(parseFloat(position.slPrice) / 1e18);
            return;
          }
        } else {
          if (parseFloat(price.toString()) < parseFloat(_oracleData.price) && parseFloat(price.toString()) !== 0) {
            toast.warning('Stop loss too low!');
            line.setPrice(parseFloat(position.slPrice) / 1e18);
            return;
          }
          if (parseFloat(price.toString()) > parseFloat(position.liqPrice) && parseFloat(price.toString()) !== 0) {
            toast.warning('Stop loss past liquidation price!');
            line.setPrice(parseFloat(position.slPrice) / 1e18);
            return;
          }
        }
      }
      const tx = tradingContract.updateTpSl(
        isTP,
        position.id,
        price,
        [
          _oracleData.provider,
          _oracleData.is_closed,
          position.asset,
          _oracleData.price,
          _oracleData.spread,
          _oracleData.timestamp
        ],
        _oracleData.signature,
        address,
        { gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0, nonce: await getShellNonce() }
      );
      const response: any = await toast.promise(tx, {
        pending: isTP ? 'Updating take profit...' : 'Updating stop loss...',
        success: undefined,
        error: isTP ? 'Updating take profit failed!' : 'Updating stop loss failed!'
      });
      // eslint-disable-next-line
      setTimeout(async () => {
        const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
        if (receipt.status === 0) {
          toast.error(isTP ? 'Updating take profit failed!' : 'Updating stop loss failed!');
          isTP
            ? line.setPrice(parseFloat(position.tpPrice) / 1e18)
            : line.setPrice(parseFloat(position.slPrice) / 1e18);
        }
      }, 1000);
    } catch (err) {
      isTP ? line.setPrice(parseFloat(position.tpPrice) / 1e18) : line.setPrice(parseFloat(position.slPrice) / 1e18);
      console.log(err);
    }
  }
  async function modifyMargin(position: any, line: IOrderLineAdapter) {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const tradingContract = await getTradingContract();
    const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);
    const currentLiq = parseFloat(position.liqPrice) / 1e18;
    const newLiqPrice = line.getPrice();
    const _oracleData: any = oracleData[asset];
    const _priceData = [
      _oracleData.provider,
      _oracleData.is_closed,
      position.asset,
      _oracleData.price,
      _oracleData.spread,
      _oracleData.timestamp
    ];

    if (position.direction) {
      if (newLiqPrice < currentLiq) {
        const newLeverage = 0.9 / (1 - newLiqPrice / (parseFloat(position.price) / 1e18));
        if (newLeverage < 2) {
          toast.warning('Leverage too low!');
          line.setPrice(currentLiq);
          return;
        }
        const positionSize =
          (parseFloat(position.margin) / 1e18) * (parseFloat(position.leverage) / 1e18) +
          parseFloat(position.accInterest) / 1e18;
        const toAdd = positionSize / newLeverage - parseFloat(position.margin) / 1e18;
        const tx = tradingContract.addMargin(
          position.id,
          currentNetwork.addresses.tigusdvault,
          currentNetwork.addresses.tigusd,
          ethers.utils.parseEther(toAdd.toFixed(18)),
          _priceData,
          _oracleData.signature,
          [0, 0, 0, ethers.constants.HashZero, ethers.constants.HashZero, false],
          address,
          { gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0, nonce: await getShellNonce() }
        );
        const response: any = await toast.promise(tx, {
          pending: 'Adding margin...',
          success: undefined,
          error: 'Adding margin failed!'
        });
        // eslint-disable-next-line
        setTimeout(async () => {
          const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
          if (receipt.status === 0) {
            toast.error('Adding margin failed!');
            line.setPrice(currentLiq);
          }
        }, 1000);
      } else if (newLiqPrice > currentLiq) {
        const newLeverage = 0.9 / (1 - newLiqPrice / (parseFloat(position.price) / 1e18));
        if (newLeverage > 100) {
          toast.warning('Leverage too high!');
          line.setPrice(currentLiq);
          return;
        }
        const positionSize =
          (parseFloat(position.margin) / 1e18) * (parseFloat(position.leverage) / 1e18) +
          parseFloat(position.accInterest) / 1e18;
        const toRemove = parseFloat(position.margin) / 1e18 - positionSize / newLeverage;
        const tx = tradingContract.removeMargin(
          position.id,
          currentNetwork.addresses.tigusdvault,
          currentNetwork.addresses.tigusd,
          ethers.utils.parseEther(toRemove.toFixed(18)),
          _priceData,
          _oracleData.signature,
          address,
          { gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0, nonce: await getShellNonce() }
        );
        const response: any = await toast.promise(tx, {
          pending: 'Removing margin...',
          success: undefined,
          error: 'Removing margin failed!'
        });
        // eslint-disable-next-line
        setTimeout(async () => {
          const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
          if (receipt.status === 0) {
            toast.error('Removing margin failed!');
            line.setPrice(currentLiq);
          }
        }, 1000);
      }
    } else {
      if (newLiqPrice > currentLiq) {
        const newLeverage = 0.9 / (newLiqPrice / (parseFloat(position.price) / 1e18) - 1);
        if (newLeverage < 2) {
          toast.warning('Leverage too low!');
          line.setPrice(currentLiq);
          return;
        }
        const positionSize =
          (parseFloat(position.margin) / 1e18) * (parseFloat(position.leverage) / 1e18) +
          parseFloat(position.accInterest) / 1e18;
        const toAdd = positionSize / newLeverage - parseFloat(position.margin) / 1e18;
        const tx = tradingContract.addMargin(
          position.id,
          currentNetwork.addresses.tigusdvault,
          currentNetwork.addresses.tigusd,
          ethers.utils.parseEther(toAdd.toFixed(18)),
          _priceData,
          _oracleData.signature,
          [0, 0, 0, ethers.constants.HashZero, ethers.constants.HashZero, false],
          address,
          { gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0, nonce: await getShellNonce() }
        );
        const response: any = await toast.promise(tx, {
          pending: 'Adding margin...',
          success: undefined,
          error: 'Adding margin failed!'
        });
        // eslint-disable-next-line
        setTimeout(async () => {
          const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
          if (receipt.status === 0) {
            toast.error('Adding margin failed!');
            line.setPrice(currentLiq);
          }
        }, 1000);
      } else if (newLiqPrice < currentLiq) {
        const newLeverage = 0.9 / (newLiqPrice / (parseFloat(position.price) / 1e18) - 1);
        if (newLeverage > 100) {
          toast.warning('Leverage too high!');
          line.setPrice(currentLiq);
          return;
        }
        const positionSize =
          (parseFloat(position.margin) / 1e18) * (parseFloat(position.leverage) / 1e18) +
          parseFloat(position.accInterest) / 1e18;
        const toRemove = parseFloat(position.margin) / 1e18 - positionSize / newLeverage;
        const tx = tradingContract.removeMargin(
          position.id,
          currentNetwork.addresses.tigusdvault,
          currentNetwork.addresses.tigusd,
          ethers.utils.parseEther(toRemove.toFixed(18)),
          _priceData,
          _oracleData.signature,
          address,
          { gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0, nonce: await getShellNonce() }
        );
        const response: any = await toast.promise(tx, {
          pending: 'Removing margin...',
          success: undefined,
          error: 'Removing margin failed!'
        });
        // eslint-disable-next-line
        setTimeout(async () => {
          const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
          if (receipt.status === 0) {
            toast.error('Removing margin failed!');
            line.setPrice(currentLiq);
          }
        }, 1000);
      }
    }
  }

  // Return chart
  return <div className={'TVChartContainer'} id={'tv_chart_container'} />;
};

export default TVChartContainer;
