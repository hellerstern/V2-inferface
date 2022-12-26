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

function createData(
  user: string,
  pair: string,
  margin: number,
  leverage: number,
  price: number,
  pnl: number,
  profit: number,
  loss: number,
  liq: number
) {
  return { user, pair, margin, leverage, price, pnl, profit, loss, liq };
}

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

const rows = [
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('trader.eth', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('trader.eth', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('trader.eth', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('longnametrader.eth', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934),
  createData('0x1234', 'C98/BUSD', 27, 2.59, 7632, 40.0, 2.509458, 305.28, 0.3840934)
];

export const PositionTable = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [openPositions, setOpenPositions] = useState<any[]>([]);
  const [limitOrders, setLimitOrders] = useState<any[]>([]);
  const [allPositions, setAllPositions] = useState<any[]>([]);

  useEffect(() => {
    if (address !== undefined) {

        const socket = socketio('https://trading-events-zcxv7.ondigitalocean.app/', {transports: ['websocket'] });

        socket.on('connect', () => {
            console.log('Events Socket Connected');
        });
    
        socket.on('error', (error:any) => {
            console.log('Events Socket Error:', error);
        });

        socket.on('disconnect', (reason: any) => {
            // setTimeout(() => {
            //     socket.connect();
            // }, 1000);
            console.log('Events Socket Disconnected:', reason);
        });
    
        socket.on('PositionOpened', (data: any) => {
            if (data.trader === address && data.chainId === chain?.id) {
                if (data.orderType === 0) {
                    const openP: any[] = openPositions;
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
                    setOpenPositions(openP);
                    console.log('EVENT: Market Trade Opened');
                } else {
                    const limitO: any[] = limitOrders;
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
                    setLimitOrders(limitO);
                    console.log('EVENT: Limit Order Created');
                }
            }
        });

        socket.on('PositionLiquidated', (data: any) => {
            if (data.trader === address && data.chainId === chain?.id) {
                const openP: any[] = openPositions;
                for (let i=0; i<openP.length; i++) {
                    if (openP[i].id === data.id) {
                        openP.splice(i, 1);
                        break;
                    }
                }
                // addToast("Position Liquidated");
                setOpenPositions(openP);
                console.log('EVENT: Position Liquidated');
            }
        });

        socket.on('PositionClosed', (data: any) => {
            if (data.trader === address && data.chainId === chain?.id) {
                const openP: any[] = openPositions;
                for (let i=0; i<openP.length; i++) {
                    if (openP[i].id === data.id) {
                        if (data.percent === 10000000000) {
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
            if (data.trader === address && data.chainId === chain?.id) {
                const limitO: any[] = limitOrders;
                const openP: any[] = openPositions;
                for (let i=0; i<limitO.length; i++) {
                    if (limitO[i].id === data.id) {
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
            if (data.trader === address && data.chainId === chain?.id) {
                const limitO: any[] = limitOrders;
                for (let i=0; i<limitO.length; i++) {
                    if (limitO[i].id === data.id) {
                        limitO.splice(i, 1);
                        break;
                    }
                }
                setLimitOrders(limitO);
                console.log('EVENT: Limit Order Cancelled');
            }
        });

        socket.on('MarginModified', (data: any) => {
            if (data.trader === address && data.chainId === chain?.id) {
                const openP: any[] = openPositions;
                for (let i=0; i<openP.length; i++) {
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
                        openP[i] = modP;
                        break;
                    }
                }
                setOpenPositions(openP);
                console.log('EVENT: Margin Modified');
            }
        });

        socket.on('AddToPosition', (data: any) => {
            if (data.trader === address && data.chainId === chain?.id) {
                const openP: any[] = openPositions;
                for (let i=0; i<openP.length; i++) {
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
                        openP[i] = modP;
                        break;
                    }
                }
                setOpenPositions(openP);
                console.log('EVENT: Added To Position');
            }
        });

        socket.on('UpdateTPSL', (data: any) => {
            if (data.trader === address && data.chainId === chain?.id) {
                const openP: any[] = openPositions;
                for (let i=0; i<openP.length; i++) {
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
}, []);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const handleClickEditOpen = (id: number) => {
    console.log('id: ', id);
    setEditModalOpen(true);
  };
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
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
              <TableCell>
                <TableCellContainer>
                  <VisibilityBox>
                    <AiFillEye style={{ fontSize: '12px', marginLeft: '0.5px' }} />
                  </VisibilityBox>{' '}
                  {row.user}
                </TableCellContainer>
              </TableCell>
              <TableCell>{row.pair}</TableCell>
              <TableCell>{row.margin}</TableCell>
              <TableCell>{row.leverage}x</TableCell>
              <TableCell>{row.price}</TableCell>
              <TableCell>{row.pnl}</TableCell>
              <TableCell>{row.profit}</TableCell>
              <TableCell>{row.loss}</TableCell>
              <TableCell>{row.liq}</TableCell>
              <TableCell>
                <ActionField id={index} editClick={handleClickEditOpen} />
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

interface ActionFieldProps {
  id: number;
  editClick: (id: number) => void;
}

const ActionField = (props: ActionFieldProps) => {
  const { id, editClick } = props;
  return (
    <ActionCotainer className="ActionField">
      <EditButton onClick={() => editClick(id)}>
        <SmallText>Edit</SmallText>
        <Edit sx={{ fontSize: '18px' }} />
      </EditButton>
      <DeleteButton onClick={() => console.log('Delete', id)}>
        Close
        <Close sx={{ fontSize: '18px' }} />
      </DeleteButton>
    </ActionCotainer>
  );
};

const ActionCotainer = styled(Box)(({ theme }) => ({
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

const DeleteButton = styled(Box)(({ theme }) => ({
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
