import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import { Close, Edit } from '@mui/icons-material';
import { AiFillEye } from 'react-icons/ai';
import { EditModal } from '../Modal/EditModal';
import socketio from "socket.io-client";
import { useAccount, useNetwork } from 'wagmi';
import { getNetwork } from "../../../src/constants/networks";
import { ethers } from 'ethers';
import { getShellWallet, getShellAddress, getShellBalance, getShellNonce, unlockShellWallet } from '../../../src/shell_wallet/index';
import { oracleData } from 'src/context/socket';
import { toast } from 'react-toastify';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#23262F'
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  },
  '.ActionField': {
    visibility: 'hidden'
  },
  '&:hover': {
    backgroundColor: '#777E90',
    '.MuiTableCell-root': {
      color: '#FFFFFF'
    },
    '.ActionField': {
      visibility: 'visible'
    }
  }
}));

interface IPositionTable {
  tableType: number; // 0 is your market, 1 is your limit, 2 is all
}
export const PositionTable = ({ tableType }: IPositionTable) => {
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
                  "fully closed @ " +
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
            // addToast("Position Limit Closed");
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
          // addToast("Limit Order Executed");
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
                toast.success((
                  "Successfully set " +
                  (parseFloat(openP[i].leverage) / 1e18).toFixed(1) + "x " +
                  currentNetwork.assets[openP[i].asset].name +
                  (openP[i].direction ? " long TP to" : " short TP to") +
                  (parseFloat(data.price) / 1e18).toPrecision(6)
                ));
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
                toast.success((
                  "Successfully set " +
                  (parseFloat(openP[i].leverage) / 1e18).toFixed(1) + "x " +
                  currentNetwork.assets[openP[i].asset].name +
                  (openP[i].direction ? " long SL to" : " short SL to") +
                  (parseFloat(data.price) / 1e18).toPrecision(6)
                ));
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

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const handleClickEditOpen = (position: any) => {
    setEditModalOpen(true);
  };

  async function getTradingContract() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const signer = await getShellWallet();
    return new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, signer);
  }

  function handleClosePositionClick(position: any) {
    closePosition(position);
  }
  // TODO toasts
  async function closePosition(position: any) {
    try {
      const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
      const _oracleData: any = oracleData[position.asset];
      const tradingContract = await getTradingContract();
      const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);

      const tx = tradingContract.initiateCloseOrder(
        position.id,
        10000000000,
        [_oracleData.provider, position.asset, _oracleData.price, _oracleData.spread, _oracleData.timestamp, _oracleData.isClosed],
        _oracleData.signature,
        currentNetwork.addresses.tigusdvault,
        currentNetwork.addresses.tigusd,
        address,
        { gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0 }
      );
      const response: any = await toast.promise(
        tx,
        {
          pending: 'Closing position...',
          success: undefined,
          error: 'Closing position failed!'
        }
      );
      if ((await tradingContract.provider.getTransactionReceipt(response.hash)).status === 0) {
        toast.error(
          'Closing position failed!'
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleCancelOrderClick(id: number) {
    cancelOrder(id);
  }
  // TODO toasts
  async function cancelOrder(id: number) {
    try {
      const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
      const tradingContract = await getTradingContract();
      const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);

      const tx = tradingContract.cancelLimitOrder(
        id,
        address,
        { gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0 }
      );
      const response: any = await toast.promise(
        tx,
        {
          pending: 'Cancelling limit order...',
          success: undefined,
          error: 'Cancelling limit order failed!'
        }
      );
      if ((await tradingContract.provider.getTransactionReceipt(response.hash)).status === 0) {
        toast.error(
          'Cancelling limit order failed!'
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <TableContainer>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Pair</TableCell>
            <TableCell>Margin</TableCell>
            <TableCell>Leverage</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Pnl</TableCell>
            <TableCell sx={{ minWidth: '110px' }}>Take Profit</TableCell>
            <TableCell sx={{ minWidth: '110px' }}>Stop Loss</TableCell>
            <TableCell>Liq</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <CustomTableBody>
          {(tableType === 0 ? openPositions : limitOrders).map((position, index) => (
            <StyledTableRow key={position.id}>
              <TableCell>
                <TableCellContainer>
                  <VisibilityBox>
                    <AiFillEye style={{ fontSize: '12px', marginLeft: '0.5px' }} />
                  </VisibilityBox>{' '}
                  {position.trader.slice(0, 6)}
                </TableCellContainer>
              </TableCell>
              <TableCell>{getNetwork(chain?.id).assets[position.asset].name}</TableCell>
              <TableCell>{(position.margin / 1e18).toFixed(2)}</TableCell>
              <TableCell>{(position.leverage / 1e18).toFixed(2)}x</TableCell>
              <TableCell>{(position.price / 1e18).toPrecision(6)}</TableCell>
              <TableCell>{"0%"}</TableCell>
              <TableCell>{(position.tpPrice / 1e18).toPrecision(6)}</TableCell>
              <TableCell>{(position.slPrice / 1e18).toPrecision(6)}</TableCell>
              <TableCell>{"0.000"}</TableCell>
              <TableCell>
                <ActionContainer className="ActionField">
                  <EditButton onClick={() => handleClickEditOpen(position.id)}>
                    <SmallText>Edit</SmallText>
                    <Edit sx={{ fontSize: '18px' }} />
                  </EditButton>
                  <CloseButton onClick={() => (tableType === 0 ? handleClosePositionClick(position) : handleCancelOrderClick(position.id))}>
                    {tableType === 0 ? "Close" : "Cancel"}
                    <Close sx={{ fontSize: '18px' }} />
                  </CloseButton>
                </ActionContainer>
              </TableCell>
            </StyledTableRow>
          ))}
        </CustomTableBody>
      </Table>
      <EditModal isState={isEditModalOpen} setState={setEditModalOpen} />
    </TableContainer>
  );
};

const TableContainer = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  overflowX: 'auto',
  '.MuiTableCell-root': {
    fontSize: '12px',
    padding: '2.5px 10px !important'
  }
}));

const CustomTableBody = styled(TableBody)(({ theme }) => ({
  '.MuiTableCell-root': {
    color: '#B1B5C3'
  }
}));

const ActionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '10px'
}));

const EditButton = styled(Box)(({ theme }) => ({
  background: 'transparent',
  color: '#FFF',
  textTransform: 'none',
  cursor: 'pointer',
  display: 'flex',
  gap: '6px',
  alignItems: 'center'
}));

const SmallText = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const CloseButton = styled(Box)(({ theme }) => ({
  color: '#FA6060',
  background: 'transparent',
  textTransform: 'none',
  cursor: 'pointer',
  display: 'flex',
  gap: '6px',
  alignItems: 'center'
}));

const VisibilityBox = styled(Box)(({ theme }) => ({
  minWidth: '14px',
  maxWidth: '14px',
  minHeight: '14px',
  maxHeight: '14px',
  backgroundColor: 'rgba(225, 225, 225, 0.18)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const TableCellContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '8px'
}));
