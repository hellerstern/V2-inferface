import { useEffect, useState } from 'react';
import socketio from "socket.io-client";
import { useAccount, useNetwork } from 'wagmi';
import { getNetwork } from "../../../src/constants/networks";
import { ethers } from 'ethers';
import { oracleData } from 'src/context/socket';
import { toast } from 'react-toastify';

export const PositionData = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [openPositions, setOpenPositions] = useState<any[]>([]);
  const [limitOrders, setLimitOrders] = useState<any[]>([]);
  const [allPositions, setAllPositions] = useState<any[]>([]);

  useEffect(() => {
    getPositionsIndex();
  }, [chain, address]);

  async function getPositionsIndex() {
    if (!chain || !address) return;
    const currentNetwork = getNetwork(chain.id);
    const positionContract = new ethers.Contract(currentNetwork.addresses.positions, currentNetwork.abis.positions, ethers.getDefaultProvider(currentNetwork.rpc));

    const userTrades = await positionContract.userTrades(address);

    const posPromisesIndex = [];
    for (let i = 0; i < userTrades.length; i++) {
      posPromisesIndex.push(positionContract.trades(userTrades[i]));
    }

    Promise.all(posPromisesIndex).then((s) => {
      const openP: any[] = [];
      const limitO: any[] = [];

      for (let i = 0; i < s.length; i++) {
        const pos = {
          trader: s[i].trader,
          margin: parseFloat(s[i].margin).toString(),
          leverage: parseFloat(s[i].leverage).toString(),
          price: parseFloat(s[i].price).toString(),
          tpPrice: parseFloat(s[i].tpPrice).toString(),
          slPrice: parseFloat(s[i].slPrice).toString(),
          direction: s[i].direction,
          id: parseInt(s[i].id),
          asset: parseFloat(s[i].asset),
          accInterest: 0
        }
        if (parseFloat(s[i].orderType) === 0) {
          openP.push(pos);
        } else {
          limitO.push(pos);
        }
      }
      setOpenPositions(openP);
      setLimitOrders(limitO);
    });
  }

  useEffect(() => {
    if (address !== undefined) {
      const socket = socketio('https://trading-events-zcxv7.ondigitalocean.app/', { transports: ['websocket'] });

      socket.on('error', (error: any) => {
        console.log('Events Socket Error:', error);
      });

      socket.on('PositionOpened', (data: any) => {
        const currentNetwork = getNetwork(0);
        if (data.trader === address && data.chainId === chain?.id) {
          if (data.orderType === 0) {
            const openP: any[] = openPositions.slice();
            openP.push(
              {
                trader: data.trader,
                margin: data.marginAfterFees,
                leverage: data.tradeInfo.leverage,
                price: data.price,
                tpPrice: data.tradeInfo.tpPrice,
                slPrice: data.tradeInfo.slPrice,
                direction: data.tradeInfo.direction,
                id: data.id,
                asset: data.tradeInfo.asset,
                accInterest: 0
              }
            );
            toast.success((
              (data.tradeInfo.direction ? "Longed " : "Shorted ") +
              (parseFloat(data.tradeInfo.leverage) / 1e18).toFixed(1) + "x " +
              currentNetwork.assets[data.tradeInfo.asset].name +
              " @ " +
              (parseFloat(data.price) / 1e18).toPrecision(6)
            ));
            setOpenPositions(openP);
            console.log('EVENT: Market Trade Opened');
          } else {
            const limitO: any[] = limitOrders.slice();
            limitO.push(
              {
                trader: data.trader,
                margin: data.tradeInfo.margin,
                leverage: data.tradeInfo.leverage,
                orderType: data.orderType,
                price: data.price,
                tpPrice: data.tradeInfo.tpPrice,
                slPrice: data.tradeInfo.slPrice,
                direction: data.tradeInfo.direction,
                id: data.id,
                asset: data.tradeInfo.asset
              }
            );
            toast.success((
              (data.tradeInfo.direction ? "Limit long " : "Limit short ") +
              (parseFloat(data.tradeInfo.leverage) / 1e18).toFixed(1) + "x " +
              currentNetwork.assets[data.tradeInfo.asset].name +
              " @ " +
              (parseFloat(data.price) / 1e18).toPrecision(6)
            ));
            setLimitOrders(limitO);
            console.log('EVENT: Limit Order Created');
          }
        }
      });

      socket.on('PositionLiquidated', (data: any) => {
        const currentNetwork = getNetwork(0);
        if (data.trader === address && data.chainId === chain?.id) {
          const openP: any[] = openPositions.slice();
          for (let i = 0; i < openP.length; i++) {
            if (openP[i].id === data.id) {
              toast.info((
                (parseFloat(openP[i].leverage) / 1e18).toFixed(1) + "x " +
                currentNetwork.assets[openP[i].asset].name +
                (openP[i].direction ? " long " : " short ") +
                "liquidated @ " +
                (parseFloat((oracleData[openP[i].asset] as any).price) / 1e18).toPrecision(6)
              ));
              openP.splice(i, 1);
              break;
            }
          }
          setOpenPositions(openP);
          console.log('EVENT: Position Liquidated');
        }
      });

      socket.on('PositionClosed', (data: any) => {
        const currentNetwork = getNetwork(0);
        if (data.trader === address && data.chainId === chain?.id) {
          const openP: any[] = openPositions.slice();
          for (let i = 0; i < openP.length; i++) {
            if (openP[i].id === data.id) {
              if (data.percent === 10000000000) {
                toast.success((
                  (parseFloat(openP[i].leverage) / 1e18).toFixed(1) + "x " +
                  currentNetwork.assets[openP[i].asset].name +
                  (openP[i].direction ? " long " : " short ") +
                  "closed @ " +
                  (parseFloat(data.price) / 1e18).toPrecision(6)
                ));
                openP.splice(i, 1);
                break;
              }
              else {
                const modP = {
                  trader: openP[i].trader,
                  margin: parseInt((openP[i].margin * (10000000000 - data.percent) / 10000000000).toString()).toString(),
                  leverage: openP[i].leverage,
                  price: openP[i].price,
                  tpPrice: openP[i].tpPrice,
                  slPrice: openP[i].slPrice,
                  direction: openP[i].direction,
                  id: data.id,
                  asset: openP[i].asset,
                  accInterest: openP[i].accInterest
                }
                toast.success((
                  (parseFloat(openP[i].leverage) / 1e18).toFixed(1) + "x " +
                  currentNetwork.assets[openP[i].asset].name +
                  (openP[i].direction ? " long " : " short ") +
                  (data.percent / 10000000000).toFixed(2) +
                  "% closed @ " +
                  (parseFloat(data.price) / 1e18).toPrecision(6)
                ));
                openP[i] = modP;
                break;
              }
            }
          }
          setOpenPositions(openP);
          if (data.trader === data.executor) {
            console.log('EVENT: Position Market Closed');
          } else {
            console.log('EVENT: Position Limit Closed');
          }
        }
      });

      socket.on('LimitOrderExecuted', (data: any) => {
        const currentNetwork = getNetwork(0);
        if (data.trader === address && data.chainId === chain?.id) {
          const limitO: any[] = limitOrders.slice();
          const openP: any[] = openPositions.slice();
          for (let i = 0; i < limitO.length; i++) {
            if (limitO[i].id === data.id) {
              toast.info((
                (parseFloat(openP[i].leverage) / 1e18).toFixed(1) + "x " +
                currentNetwork.assets[openP[i].asset].name +
                (openP[i].direction ? " long " : " short ") +
                "limit order filled @ " +
                (parseFloat(data.oPrice) / 1e18).toPrecision(6)
              ));
              openP.push(
                {
                  trader: data.trader,
                  margin: data.margin,
                  leverage: data.lev,
                  price: data.oPrice,
                  tpPrice: limitO[i].tpPrice,
                  slPrice: limitO[i].slPrice,
                  direction: data.direction,
                  id: data.id,
                  asset: data.asset,
                  accInterest: 0
                }
              );
              limitO.splice(i, 1);
              break;
            }
          }
          setOpenPositions(limitO);
          setOpenPositions(openP);
          console.log('EVENT: Limit Order Executed');
        }
      });

      socket.on('LimitCancelled', (data: any) => {
        const currentNetwork = getNetwork(0);
        if (data.trader === address && data.chainId === chain?.id) {
          const limitO: any[] = limitOrders.slice();
          for (let i = 0; i < limitO.length; i++) {
            if (limitO[i].id === data.id) {
              toast.success((
                (parseFloat(limitO[i].leverage) / 1e18).toFixed(1) + "x " +
                currentNetwork.assets[limitO[i].asset].name +
                (limitO[i].direction ? " long " : " short ") +
                "limit order cancelled"
              ));
              limitO.splice(i, 1);
              break;
            }
          }
          setLimitOrders(limitO);
          console.log('EVENT: Limit Order Cancelled');
        }
      });

      socket.on('MarginModified', (data: any) => {
        const currentNetwork = getNetwork(0);
        if (data.trader === address && data.chainId === chain?.id) {
          const openP: any[] = openPositions.slice();
          for (let i = 0; i < openP.length; i++) {
            if (openP[i].id === data.id) {
              const modP = {
                trader: openP[i].trader,
                margin: data.newMargin,
                leverage: data.newLeverage,
                price: openP[i].price,
                tpPrice: openP[i].tpPrice,
                slPrice: openP[i].slPrice,
                direction: openP[i].direction,
                id: data.id,
                asset: openP[i].asset,
                accInterest: openP[i].accInterest
              }
              toast.success((
                "Successfully added " +
                ((parseFloat(data.newMargin) - parseFloat(openP[i].margin)) / 1e18).toFixed(2) +
                " margin to " +
                (parseFloat(openP[i].leverage) / 1e18).toFixed(1) + "x " +
                currentNetwork.assets[openP[i].asset].name +
                (openP[i].direction ? " long" : " short")
              ));
              openP[i] = modP;
              break;
            }
          }
          setOpenPositions(openP);
          console.log('EVENT: Margin Modified');
        }
      });

      socket.on('AddToPosition', (data: any) => {
        const currentNetwork = getNetwork(0);
        if (data.trader === address && data.chainId === chain?.id) {
          const openP: any[] = openPositions.slice();
          for (let i = 0; i < openP.length; i++) {
            if (openP[i].id === data.id) {
              const modP = {
                trader: openP[i].trader,
                margin: data.newMargin,
                leverage: openP[i].leverage,
                price: data.newPrice,
                tpPrice: openP[i].tpPrice,
                slPrice: openP[i].slPrice,
                direction: openP[i].direction,
                id: data.id,
                asset: openP[i].asset,
                accInterest: openP[i].accInterest
              }
              toast.success((
                "Successfully opened " +
                (parseFloat(openP[i].leverage) / 1e18).toFixed(1) + "x " +
                ((parseFloat(data.newMargin) - parseFloat(openP[i].margin)) / 1e18).toFixed(2) +
                " position on " +
                currentNetwork.assets[openP[i].asset].name +
                (openP[i].direction ? " long" : " short")
              ));
              openP[i] = modP;
              break;
            }
          }
          setOpenPositions(openP);
          console.log('EVENT: Added To Position');
        }
      });

      socket.on('UpdateTPSL', (data: any) => {
        const currentNetwork = getNetwork(0);
        if (data.trader === address && data.chainId === chain?.id) {
          const openP: any[] = openPositions.slice();
          for (let i = 0; i < openP.length; i++) {
            if (openP[i].id === data.id) {
              console.log(openP[i]);
              if (data.isTp) {
                const modP = {
                  trader: openP[i].trader,
                  margin: openP[i].margin,
                  leverage: openP[i].leverage,
                  price: openP[i].price,
                  tpPrice: data.price,
                  slPrice: openP[i].slPrice,
                  direction: openP[i].direction,
                  id: data.id,
                  asset: openP[i].asset,
                  accInterest: openP[i].accInterest
                }
                if (parseFloat(data.price) === 0) {
                  toast.success((
                    "Successfully removed TP from " +
                    (openP[i].direction ? "long " : "short ") +
                    (parseFloat(openP[i].leverage) / 1e18).toFixed(1) + "x " +
                    currentNetwork.assets[openP[i].asset].name
                  ));                  
                } else {
                  toast.success((
                    "Successfully set " +
                    (parseFloat(openP[i].leverage) / 1e18).toFixed(1) + "x " +
                    currentNetwork.assets[openP[i].asset].name +
                    (openP[i].direction ? " long TP to " : " short TP to ") +
                    (parseFloat(data.price) / 1e18).toPrecision(7)
                  ));
                }
                openP[i] = modP;
                console.log('EVENT: TP Updated');
              } else {
                const modP = {
                  trader: openP[i].trader,
                  margin: openP[i].margin,
                  leverage: openP[i].leverage,
                  price: openP[i].price,
                  tpPrice: openP[i].tpPrice,
                  slPrice: data.price,
                  direction: openP[i].direction,
                  id: data.id,
                  asset: openP[i].asset,
                  accInterest: openP[i].accInterest
                }
                if (parseFloat(data.price) === 0) {
                  toast.success((
                    "Successfully removed SL from " +
                    (openP[i].direction ? "long " : "short ") +
                    (parseFloat(openP[i].leverage) / 1e18).toFixed(1) + "x " +
                    currentNetwork.assets[openP[i].asset].name
                  ));
                } else {
                  toast.success((
                    "Successfully set " +
                    (parseFloat(openP[i].leverage) / 1e18).toFixed(1) + "x " +
                    currentNetwork.assets[openP[i].asset].name +
                    (openP[i].direction ? " long SL to " : " short SL to ") +
                    (parseFloat(data.price) / 1e18).toPrecision(7)
                  ));
                }
                openP[i] = modP;
                console.log('EVENT: SL Updated');
              }
              break;
            }
          }
          setOpenPositions(openP);
        }
      });

      return () => {
        socket.disconnect();
      }
    }
  }, [address, chain, openPositions, limitOrders]);

  return (
    {
      positionData : {
        openPositions: openPositions,
        limitOrders: limitOrders,
        allPositions: allPositions
      }
    }
  );
};