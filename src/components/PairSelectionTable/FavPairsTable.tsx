import { Star, StarBorder } from '@mui/icons-material';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';
import { adaLogo, algoLogo, atomLogo, avaxLogo, bchLogo, btcLogo, bnbLogo, dogeLogo, dotLogo,
  ethLogo, linkLogo, ltcLogo, maticLogo, nearLogo, solLogo, uniLogo, xmrLogo } from '../../config/images';
import { getNetwork } from "src/constants/networks";
import { oracleSocket } from 'src/context/socket';

function createData(pair: React.ReactElement, profit: React.ReactElement, pairIndex: number) {
  return {
    pair,
    profit,
    pairIndex
  };
}

interface PairFieldProps {
  favor: boolean;
  handleFavoriteToggle: any;
  icon: string;
  name: string;
}
const PairField = ({ favor, handleFavoriteToggle, icon, name }: PairFieldProps) => {

  const handleStarClick = (event: React.MouseEvent, setFav: boolean) => {
    handleFavoriteToggle(name, setFav);
    event.stopPropagation();
  }

  return (
    <PairFieldContainer>
      {favor ? (
        <IconButton onClick={(e) => {
            handleStarClick(e, false)
          }} sx={{padding: '0px'}}>
          <Star sx={{ color: '#FABE3C', width: '20px', height: '20px' }}/>
        </IconButton>
      ) : (
        <IconButton onClick={(e) => {
            handleStarClick(e, true)
          }} sx={{padding: '0px'}}>
          <StarBorder sx={{ width: '20px', height: '20px' }}/>
        </IconButton>
      )}
      <img src={icon} style={{maxHeight: '24px'}}/>
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
  useEffect(() => {
    oracleSocket.on('data', (data: any) => {
      if (data[pairIndex] != null && data[pairIndex].price !== oraclePrice) {
        setOraclePrice(data[pairIndex].price);
      }
    });
  }, []);
  
  const [oraclePrice, setOraclePrice] = useState("Loading..." as any);

  return (
    <>
    <TableCell align="center" sx={{ width: '125px' }} onClick={() => setPairIndex(pairIndex)}>
      {oraclePrice === "Loading..." ? "Loading..." : (oraclePrice/1e18).toFixed(getNetwork(0).assets[pairIndex].decimals)}
    </TableCell>
    </>
  )
}

export const FavPairsTable = ({setPairIndex, searchQuery}: Props) => {

  const [FavPairs, setFavPairs] = useState<string[]>(
    JSON.parse(localStorage.getItem("FavPairs") === null ? '["BTC/USD", "ETH/USD"]' : localStorage.getItem("FavPairs") as string) as string[]
  );

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
      <PairField favor={FavPairs.includes('ADA/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={adaLogo} name={'ADA/USD'} />,
      <Benefit percent={-1.95} value={-1421000} />,
      14
    ),
    createData(
      <PairField favor={FavPairs.includes('ALGO/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={algoLogo} name={'ALGO/USD'} />,
      <Benefit percent={-12.08} value={-25} />,
      30
    ),
    createData(
      <PairField favor={FavPairs.includes('ATOM/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={atomLogo} name={'ATOM/USD'} />,
      <Benefit percent={6.62} value={60.0} />,
      15
    ),
    createData(
      <PairField favor={FavPairs.includes('AVAX/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={avaxLogo} name={'AVAX/USD'} />,
      <Benefit percent={-1.95} value={-1421000} />,
      26
    ),
    createData(
      <PairField favor={FavPairs.includes('BCH/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={bchLogo} name={'BCH/USD'} />,
      <Benefit percent={-12.08} value={-25.0} />,
      21
    ),
    createData(
      <PairField favor={FavPairs.includes('BNB/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={bnbLogo} name={'BNB/USD'} />,
      <Benefit percent={6.62} value={60.0} />,
      13
    ),
    createData(
      <PairField favor={FavPairs.includes('BTC/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={btcLogo} name={'BTC/USD'} />,
      <Benefit percent={0.63} value={110} />,
      0
    ),
    createData(
      <PairField favor={FavPairs.includes('CAD/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={btcLogo} name={'CAD/USD'} />,
      <Benefit percent={0.63} value={110} />,
      10
    ),
    createData(
      <PairField favor={FavPairs.includes('DOGE/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={dogeLogo} name={'DOGE/USD'} />,
      <Benefit percent={6.62} value={60.0} />,
      19
    ),
    createData(
      <PairField favor={FavPairs.includes('DOT/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={dotLogo} name={'DOT/USD'} />,
      <Benefit percent={6.62} value={60.0} />,
      23
    ),
    createData(
      <PairField favor={FavPairs.includes('ETH/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={ethLogo} name={'ETH/USD'} />,
      <Benefit percent={-6.62} value={-60.0} />,
      1
    ),
    createData(
      <PairField favor={FavPairs.includes('ETH/BTC')} handleFavoriteToggle={handleFavoriteToggle} icon={ethLogo} name={'ETH/BTC'} />,
      <Benefit percent={0.63} value={110} />,
      11
    ),
    createData(
      <PairField favor={FavPairs.includes('EUR/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={btcLogo} name={'EUR/USD'} />,
      <Benefit percent={0.63} value={110} />,
      5
    ),
    createData(
      <PairField favor={FavPairs.includes('GBP/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={btcLogo} name={'GBP/USD'} />,
      <Benefit percent={0.63} value={110} />,
      6
    ),
    createData(
      <PairField favor={FavPairs.includes('JPY/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={btcLogo} name={'JPY/USD'} />,
      <Benefit percent={0.63} value={110} />,
      7
    ),
    createData(
      <PairField favor={FavPairs.includes('LINK/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={linkLogo} name={'LINK/USD'} />,
      <Benefit percent={6.62} value={60.0} />,
      4
    ),
    createData(
      <PairField favor={FavPairs.includes('LINK/BTC')} handleFavoriteToggle={handleFavoriteToggle} icon={linkLogo} name={'LINK/BTC'} />,
      <Benefit percent={0.63} value={110} />,
      33
    ),
    createData(
      <PairField favor={FavPairs.includes('LTC/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={ltcLogo} name={'LTC/USD'} />,
      <Benefit percent={6.62} value={60.0} />,
      20
    ),
    createData(
      <PairField favor={FavPairs.includes('MATIC/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={maticLogo} name={'MATIC/USD'} />,
      <Benefit percent={6.62} value={60.0} />,
      3
    ),
    createData(
      <PairField favor={FavPairs.includes('NEAR/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={nearLogo} name={'NEAR/USD'} />,
      <Benefit percent={6.62} value={60.0} />,
      29
    ),
    createData(
      <PairField favor={FavPairs.includes('SOL/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={solLogo} name={'SOL/USD'} />,
      <Benefit percent={6.62} value={60.0} />,
      18
    ),
    createData(
      <PairField favor={FavPairs.includes('UNI/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={uniLogo} name={'UNI/USD'} />,
      <Benefit percent={6.62} value={60.0} />,
      27
    ),
    createData(
      <PairField favor={FavPairs.includes('XAG/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={btcLogo} name={'XAG/USD'} />,
      <Benefit percent={0.63} value={110} />,
      32
    ),
    createData(
      <PairField favor={FavPairs.includes('XAU/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={btcLogo} name={'XAU/USD'} />,
      <Benefit percent={0.63} value={110} />,
      2
    ),
    createData(
      <PairField favor={FavPairs.includes('XMR/USD')} handleFavoriteToggle={handleFavoriteToggle} icon={xmrLogo} name={'XMR/USD'} />,
      <Benefit percent={6.62} value={60.0} />,
      24
    ),
    createData(
      <PairField favor={FavPairs.includes('XMR/BTC')} handleFavoriteToggle={handleFavoriteToggle} icon={xmrLogo} name={'XMR/BTC'} />,
      <Benefit percent={0.63} value={110} />,
      34
    )
  ]
  .filter(pair => (pair.pair.props.favor))
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
              <CustomTableRow key={index} onClick={() => setPairIndex(row.pairIndex)}>
                <TableCell sx={{ width: '150px' }}>{row.pair}</TableCell>
                <PriceCell setPairIndex={setPairIndex} pairIndex={row.pairIndex}/>
                <TableCell align="center">{row.profit}</TableCell>
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
  letterSpacing: '1.25px',
  border: '10px solid rgba(0, 0, 0, 0)',
  marginLeft: '-10px'
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
