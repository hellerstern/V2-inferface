import { Star, StarBorder } from '@mui/icons-material';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import React, { useEffect } from 'react';
import { adaLogo, algoLogo, atomLogo, avaxLogo, bchLogo, btcLogo, bnbLogo, dogeLogo, dotLogo,
  ethLogo, linkLogo, ltcLogo, maticLogo, nearLogo, solLogo, uniLogo, xmrLogo } from '../../config/images';
import { getNetwork } from "src/constants/networks";
import { oracleSocket } from 'src/context/socket';

function createData(pair: React.ReactElement, price: number, profit: React.ReactElement, pairIndex: number) {
  return {
    pair,
    price,
    profit,
    pairIndex
  };
}

interface PairFieldProps {
  favor: boolean;
  handleFavoriteToggle: any;
  setPairIndex: any;
  pairIndex: number;
  icon: string;
  name: string;
}
const PairField = ({ favor, handleFavoriteToggle, setPairIndex, pairIndex, icon, name }: PairFieldProps) => {
  return (
    <PairFieldContainer>
      {favor ? (
        <IconButton onClick={() => {
            handleFavoriteToggle(name, false);
          }} sx={{padding: '0px'}}>
          <Star sx={{ color: '#FABE3C', width: '20px', height: '20px' }}/>
        </IconButton>
      ) : (
        <IconButton onClick={() => {
            handleFavoriteToggle(name, true);
          }} sx={{padding: '0px'}}>
          <StarBorder sx={{ width: '20px', height: '20px' }}/>
        </IconButton>
      )}
      <img src={icon} style={{maxHeight: '24px'}} onClick={() => setPairIndex(pairIndex)}/>
      <CoinName onClick={() => setPairIndex(pairIndex)}>{name}</CoinName>
    </PairFieldContainer>
  );
};

interface BenefitProps {
  percent: number;
  value: number;
}

const Benefit = ({ percent, value }: BenefitProps) => {
  return (
    <BenefitContainer sx={{ color: percent > 0 ? '#26A69A' : '#EF534F' }}>
      {percent > 0 ? `+${percent}` : percent.toFixed(2)}%<p>{value.toFixed(2)}</p>
    </BenefitContainer>
  );
};

interface Props {
  setPairIndex: any;
  searchQuery: any;
}

interface PriceCellProps {
  setPairIndex: any;
  pairIndex: any;
}

export const PriceCell = ({setPairIndex, pairIndex}: PriceCellProps) => {
  React.useEffect(() => {
    oracleSocket.on('data', (data: any) => {
      if (data[pairIndex].price !== oraclePrice) {
        setOraclePrice(data[pairIndex].price);
      }
    });
  }, []);
  
  const [oraclePrice, setOraclePrice] = React.useState(0);

  return (
    <>
    <TableCell align="center" sx={{ width: '125px' }} onClick={() => setPairIndex(pairIndex)}>
      {(oraclePrice/1e18).toFixed(getNetwork(0).assets[pairIndex].decimals)}
    </TableCell>
    </>
  )
}

function sortFavorites(a: any, b: any) {
  if (a.pair.props.favor === b.pair.props.favor) {
    return 0;
  }
  if (a.pair.props.favor) {
    return -1;
  }
  return 1;
}

export const USDPairsTable = ({setPairIndex, searchQuery}: Props) => {

  const [FavPairs, setFavPairs] = React.useState<string[]>(["BTC/USD", "ETH/USD"]);
  useEffect(() => {
    setFavPairs(JSON.parse(localStorage.getItem("FavPairs") as string) as string[]);
  }, []);

  function handleFavoriteToggle(name: string, setFav: boolean) {
    const favPairs: any = JSON.parse(localStorage.getItem("FavPairs") as string);
    if (setFav) {
      favPairs.push(name);
    } else {
      favPairs.splice(FavPairs.indexOf(name), 1);
    }
    localStorage.setItem("FavPairs", JSON.stringify(favPairs));
    setFavPairs(favPairs);
  }

  const rows = [
    createData(
      <PairField favor={FavPairs.includes('ADA/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={14} icon={adaLogo} name={'ADA/USD'} />,
      0,
      <Benefit percent={-1.95} value={-1421000} />,
      14
    ),
    createData(
      <PairField favor={FavPairs.includes('ALGO/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={30} icon={algoLogo} name={'ALGO/USD'} />,
      0,
      <Benefit percent={-12.08} value={-25} />,
      30
    ),
    createData(
      <PairField favor={FavPairs.includes('ATOM/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={15} icon={atomLogo} name={'ATOM/USD'} />,
      0,
      <Benefit percent={6.62} value={60.0} />,
      15
    ),
    createData(
      <PairField favor={FavPairs.includes('AVAX/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={26} icon={avaxLogo} name={'AVAX/USD'} />,
      0,
      <Benefit percent={-1.95} value={-1421000} />,
      26
    ),
    createData(
      <PairField favor={FavPairs.includes('BCH/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={21} icon={bchLogo} name={'BCH/USD'} />,
      0,
      <Benefit percent={-12.08} value={-25.0} />,
      21
    ),
    createData(
      <PairField favor={FavPairs.includes('BNB/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={13} icon={bnbLogo} name={'BNB/USD'} />,
      0,
      <Benefit percent={6.62} value={60.0} />,
      13
    ),
    createData(
      <PairField favor={FavPairs.includes('BTC/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={0} icon={btcLogo} name={'BTC/USD'} />,
      0,
      <Benefit percent={0.63} value={110} />,
      0
    ),
    createData(
      <PairField favor={FavPairs.includes('DOGE/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={19} icon={dogeLogo} name={'DOGE/USD'} />,
      0,
      <Benefit percent={6.62} value={60.0} />,
      19
    ),
    createData(
      <PairField favor={FavPairs.includes('DOT/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={23} icon={dotLogo} name={'DOT/USD'} />,
      0,
      <Benefit percent={6.62} value={60.0} />,
      23
    ),
    createData(
      <PairField favor={FavPairs.includes('ETH/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={1} icon={ethLogo} name={'ETH/USD'} />,
      0,
      <Benefit percent={-6.62} value={-60.0} />,
      1
    ),
    createData(
      <PairField favor={FavPairs.includes('LINK/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={4} icon={linkLogo} name={'LINK/USD'} />,
      0,
      <Benefit percent={6.62} value={60.0} />,
      4
    ),
    createData(
      <PairField favor={FavPairs.includes('LTC/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={20} icon={ltcLogo} name={'LTC/USD'} />,
      0,
      <Benefit percent={6.62} value={60.0} />,
      20
    ),
    createData(
      <PairField favor={FavPairs.includes('MATIC/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={3} icon={maticLogo} name={'MATIC/USD'} />,
      0,
      <Benefit percent={6.62} value={60.0} />,
      3
    ),
    createData(
      <PairField favor={FavPairs.includes('NEAR/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={29} icon={nearLogo} name={'NEAR/USD'} />,
      0,
      <Benefit percent={6.62} value={60.0} />,
      29
    ),
    createData(
      <PairField favor={FavPairs.includes('SOL/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={18} icon={solLogo} name={'SOL/USD'} />,
      0,
      <Benefit percent={6.62} value={60.0} />,
      18
    ),
    createData(
      <PairField favor={FavPairs.includes('UNI/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={27} icon={uniLogo} name={'UNI/USD'} />,
      0,
      <Benefit percent={6.62} value={60.0} />,
      27
    ),
    createData(
      <PairField favor={FavPairs.includes('XMR/USD')} handleFavoriteToggle={handleFavoriteToggle} setPairIndex={setPairIndex} pairIndex={24} icon={xmrLogo} name={'XMR/USD'} />,
      0,
      <Benefit percent={6.62} value={60.0} />,
      24
    )
  ]
  .sort(sortFavorites)
  .filter(pair => (pair.pair.props.name).includes(searchQuery));

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
                <TableCell sx={{ width: '150px' }}>{row.pair}</TableCell>
                <PriceCell setPairIndex={setPairIndex} pairIndex={row.pairIndex}/>
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
