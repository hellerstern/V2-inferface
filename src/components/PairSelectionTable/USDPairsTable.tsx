import { Star, StarBorder } from '@mui/icons-material';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { adaLogo, algoLogo, atomLogo, avaxLogo, bchLogo, btcLogo, bnbLogo, dogeLogo, dotLogo,
  ethLogo, linkLogo, ltcLogo, maticLogo, nearLogo, solLogo, uniLogo, xmrLogo } from '../../config/images';

interface PairFieldProps {
  favor: boolean;
  icon: string;
  name: string;
}

function createData(pair: React.ReactElement, price: number, profit: React.ReactElement, pairIndex: number) {
  return {
    pair,
    price,
    profit,
    pairIndex
  };
}

const PairField = ({ favor, icon, name }: PairFieldProps) => {
  return (
    <PairFieldContainer>
      {favor ? (
        <IconButton onClick={() => null} sx={{padding: '0px'}}>
          <Star sx={{ color: '#FABE3C', width: '20px', height: '20px' }}/>
        </IconButton>
      ) : (
        <IconButton onClick={() => null} sx={{padding: '0px'}}>
          <StarBorder sx={{ width: '20px', height: '20px' }}/>
        </IconButton>
      )}
      <IconBox>
        <img src={icon} style={{maxHeight: '20px'}} />
      </IconBox>
      <CoinName>{name}</CoinName>
    </PairFieldContainer>
  );
};

interface BenefitProps {
  percent: number;
  value: number;
}

const Benefit = ({ percent, value }: BenefitProps) => {
  return (
    <BenefitContainer sx={{ color: percent > 0 ? '#58BD7D' : '#D33535' }}>
      {percent > 0 ? `+${percent}` : percent.toFixed(2)}%<p>{value.toFixed(2)}</p>
    </BenefitContainer>
  );
};

const rows = [
  createData(
    <PairField favor={true} icon={btcLogo} name={'BTC/USD'} />,
    17810,
    <Benefit percent={0.63} value={110} />,
    0
  ),
  createData(
    <PairField favor={true} icon={ethLogo} name={'ETH/USD'} />,
    846,
    <Benefit percent={-6.62} value={-60.0} />,
    1
  ),
  createData(
    <PairField favor={false} icon={adaLogo} name={'ADA/USD'} />,
    71729000,
    <Benefit percent={-1.95} value={-1421000} />,
    14
  ),
  createData(
    <PairField favor={false} icon={algoLogo} name={'ALGO/USD'} />,
    180,
    <Benefit percent={-12.08} value={-25} />,
    30
  ),
  createData(
    <PairField favor={false} icon={atomLogo} name={'ATOM/USD'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />,
    15
  ),
  createData(
    <PairField favor={false} icon={avaxLogo} name={'AVAX/USD'} />,
    71729000,
    <Benefit percent={-1.95} value={-1421000} />,
    26
  ),
  createData(
    <PairField favor={false} icon={bchLogo} name={'BCH/USD'} />,
    180,
    <Benefit percent={-12.08} value={-25.0} />,
    21
  ),
  createData(
    <PairField favor={false} icon={bnbLogo} name={'BNB/USD'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />,
    13
  ),
  createData(
    <PairField favor={false} icon={dogeLogo} name={'DOGE/USD'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />,
    19
  ),
  createData(
    <PairField favor={false} icon={dotLogo} name={'DOT/USD'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />,
    23
  ),
  createData(
    <PairField favor={false} icon={linkLogo} name={'LINK/USD'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />,
    4
  ),
  createData(
    <PairField favor={false} icon={ltcLogo} name={'LTC/USD'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />,
    20
  ),
  createData(
    <PairField favor={false} icon={maticLogo} name={'MATIC/USD'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />,
    3
  ),
  createData(
    <PairField favor={false} icon={nearLogo} name={'NEAR/USD'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />,
    29
  ),
  createData(
    <PairField favor={false} icon={solLogo} name={'SOL/USD'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />,
    18
  ),
  createData(
    <PairField favor={false} icon={uniLogo} name={'UNI/USD'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />,
    27
  ),
  createData(
    <PairField favor={false} icon={xmrLogo} name={'XMR/USD'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />,
    24
  )
];

interface Props {
  setPairIndex: any;
}

export const USDPairsTable = ({setPairIndex}: Props) => {
  return (
    <>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#777E90', width: '150px' }}>Pair</TableCell>
            <TableCell sx={{ color: '#777E90', width: '125px' }}>Current Price</TableCell>
            <TableCell align="center" sx={{ color: '#777E90' }}>
              24h
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <TbodyContainer>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableBody>
            {rows.map((row, index) => (
              <CustomTableRow key={index}>
                <TableCell sx={{ width: '150px' }} onClick={() => setPairIndex(row.pairIndex)}>{row.pair}</TableCell>
                <TableCell align="center" sx={{ width: '125px' }} onClick={() => setPairIndex(row.pairIndex)}>
                  {row.price}
                </TableCell>
                <TableCell align="center" onClick={() => setPairIndex(row.pairIndex)}>{row.profit}</TableCell>
              </CustomTableRow>
            ))}
          </TableBody>
        </Table>
      </TbodyContainer>
    </>
  );
};

const PairFieldContainer = styled(Box)({
  display: 'flex',
  gap: '10px',
  alignItems: 'center'
});

const IconBox = styled(Box)({
  padding: '5px',
  minWidth: '30px',
  minHeight: '30px',
  borderRadius: '100px',
  backgroundColor: '#FFFFFF',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const CoinName = styled(Box)({
  fontWeight: 700,
  fontSize: '12px',
  letterSpacing: '1.25px'
});

const BenefitContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  fontSize: '12px',
  fontWeight: 400
});

const CustomTableRow = styled(TableRow)({
  '&:hover': { backgroundColor: '#1E1F25', cursor: 'pointer' }
});

const TbodyContainer = styled(Box)(({ theme }) => ({
  height: '400px',
  overflowY: 'auto'
}));
