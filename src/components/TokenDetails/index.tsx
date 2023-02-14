import { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

import * as logos from '../../../src/config/images';

import { AiFillStar } from 'react-icons/ai';
import { Container } from '../../../src/components/Container';
import usePreventBodyScroll from '../../../src/hook/usePreventBodyScroll';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from './arrow';
import { eu1oracleSocket, lastOracleTime } from '../../../src/context/socket';
import { PairSelectionModal } from '../Modal/PairSelectionModal';
import { useCloseFees, useOpenFees, useOpenInterest, usePairData, useReferral, useVaultFunding } from 'src/hook/useTradeInfo';
import { ethers } from 'ethers';
import { getNetwork } from 'src/constants/networks';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface ITokenDetails {
  pairIndex: number;
  setPairIndex: (value: number) => void;
}

export const TokenDetails = ({
  pairIndex,
  setPairIndex
}: ITokenDetails) => {
  const { assets } = getNetwork(0);
  const LogoArray = [
    logos.btcLogo,
    logos.ethLogo,
    logos.goldLogo,
    logos.maticLogo,
    logos.linkLogo,
    logos.eurLogo,
    logos.gbpLogo,
    logos.jpyLogo,
    logos.btcLogo, // rub
    logos.btcLogo, // chf
    logos.cadLogo,
    logos.ethLogo, // eth/btc
    logos.xrpLogo,
    logos.bnbLogo,
    logos.adaLogo,
    logos.atomLogo,
    logos.btcLogo, // hbar
    logos.btcLogo, // tron
    logos.solLogo,
    logos.dogeLogo,
    logos.ltcLogo,
    logos.bchLogo,
    logos.btcLogo, // etc
    logos.dotLogo,
    logos.xmrLogo,
    logos.btcLogo, // shib
    logos.avaxLogo,
    logos.uniLogo,
    logos.btcLogo, // xlm
    logos.nearLogo,
    logos.algoLogo,
    logos.btcLogo, // icp
    logos.silverLogo, // xag
    logos.linkLogo, // link/btc
    logos.xmrLogo // xmr/btc
  ];

  useEffect(() => {
    eu1oracleSocket.on('data', (data: any) => {
      setOracleData(data);
    });
  }, []);
  const [oracleData, setOracleData] = useState(Array(35).fill({ price: '0', spread: '0' }));

  const [oi, setOi] = useState<any>({longOi: 0, shortOi: 0, maxOi: 0});
  const liveOi = useOpenInterest(pairIndex);
  useEffect(() => {
    setOi(liveOi);
  }, [liveOi]);

  const [pairData, setPairData] = useState<any>({});
  const livePairData = usePairData(pairIndex);
  useEffect(() => {
    setPairData(livePairData);
  }, [livePairData]);

  const [openFees, setOpenFees] = useState<any>({});
  const liveOpenFees = useOpenFees();
  useEffect(() => {
    setOpenFees(liveOpenFees);
  }, [liveOpenFees]);

  const [closeFees, setCloseFees] = useState<any>({});
  const liveCloseFees = useCloseFees();
  useEffect(() => {
    setCloseFees(liveCloseFees);

  }, [liveCloseFees]);

  const [vaultFunding, setVaultFunding] = useState<any>({});
  const liveVaultFunding = useVaultFunding();
  useEffect(() => {
    setVaultFunding(liveVaultFunding);
  }, [liveVaultFunding]);

  const [referral, setReferral] = useState<any>({});
  const liveReferral = useReferral();
  useEffect(() => {
    setReferral(liveReferral);
  }, [liveReferral]);

  useEffect(() => {
    calculateFundingAPR();
  }, [vaultFunding, pairData, oi]);

  const [longAPRHourly, setLongAPRHourly] = useState(0);
  const [shortAPRHourly, setShortAPRHourly] = useState(0);

  function calculateFundingAPR() {
    const longOi = Number(oi?.longOi);
    const shortOi = Number(oi?.shortOi);

    const diff = longOi > shortOi ? longOi - shortOi : shortOi - longOi;

    const baseFundingRate = pairData?.baseFundingRate;
    const base = diff * baseFundingRate;

    let shortAPR = base/shortOi;
    let longAPR = base/longOi;

    if(longOi > shortOi) shortAPR = shortAPR * -1;
    else longAPR = longAPR * -1;

    let shortAPRHourly = shortAPR/365/24/1e8;
    let longAPRHourly = longAPR/365/24/1e8;

    if (longOi < shortOi) {
      longAPRHourly = longAPRHourly*(1e10-vaultFunding)/1e10;
    } else if (shortOi < longOi) {
      shortAPRHourly = shortAPRHourly*(1e10-vaultFunding)/1e10;
    } else if (longOi === 0 && shortOi === 0) {
      longAPRHourly = 0;
      shortAPRHourly = 0;
    }
    setShortAPRHourly(shortAPRHourly);
    setLongAPRHourly(longAPRHourly);
  }

  function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
    const isTouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isTouchpad) {
      ev.stopPropagation();
      return;
    }

    if (ev.deltaY < 0) {
      apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
      apiObj.scrollPrev();
    }
  }
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleTokenClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <TradeContainer>
      <Container>
        <TradeWrapper>
          <KindOfToken onClick={handleTokenClick}>
            <Tokens>
              <img src={LogoArray[pairIndex]} style={{ height: '28px' }} />
              <span className="token-name">{assets[pairIndex].name}</span>
              <Box className="multi-value">
                <span>{assets[pairIndex].maxLev}X</span>
              </Box>
            </Tokens>
            <AiFillStar />
          </KindOfToken>
          <PairSelectionModal
            state={anchorEl}
            setState={setAnchorEl}
            pairIndex={pairIndex}
            setPairIndex={setPairIndex}
          />
          <DesktopStatusInfos onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
            <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} onWheel={onWheel}>
              <Box className="index-info">
                <p className="title">Oracle Price</p>
                <p className="value">
                  {
                    oracleData[pairIndex]
                      ? (parseInt(oracleData[pairIndex].price) / 1e18).toPrecision(6)
                      : 'Loading...'
                  }
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Price Spread</p>
                <p className="value">
                  {
                    oracleData[pairIndex] != null
                      ? ((oracleData[pairIndex].spread as unknown as number) / 1e8).toFixed(3) + '%'
                      : '0.000%'
                  }
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Long Open Interest</p>
                <p className="value">
                  {
                    (oi ? oi.longOi / 1e18 : 0).toFixed(0) + '/'
                  }
                  <span>{oi ? oi.maxOi.toString() === '0' ? 'Unlimited' : (oi.maxOi / 1e18).toString() : "Unlimited"}</span>
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Short Open Interest</p>
                <p className="value">
                  {
                    (oi ? oi.shortOi / 1e18 : 0).toFixed(0) + '/'
                  }
                  <span>{oi ? oi.maxOi.toString() === '0' ? 'Unlimited' : (oi.maxOi / 1e18).toString() : "Unlimited"}</span>
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Open Fee</p>
                <p className="value">
                  {
                    openFees ? (((Number(openFees.daoFees) + Number(openFees.burnFees) - (referral !== ethers.constants.HashZero ? openFees.referralFees/1e10 : 0))*(pairData?.feeMultiplier/1e10))/1e8).toFixed(3) + "%" : "0.100%"
                  }
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Close Fee</p>
                <p className="value">
                  {
                    closeFees ? (((Number(closeFees.daoFees) + Number(closeFees.burnFees) - (referral !== ethers.constants.HashZero ? closeFees.referralFees/1e10 : 0))*(pairData?.feeMultiplier/1e10))/1e8).toFixed(3) + "%" : "0.100%"
                  }
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Long Funding Fee</p>
                <p className="value" style={{ color: longAPRHourly <= 0 || isNaN(longAPRHourly) ? '#26A69A' : '#EF534F' }}>
                  {
                    longAPRHourly.toFixed(5).replace('NaN', '0.00000').replace('Infinity', 'ထ') + '% Per Hour'
                  }
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Short Funding Fee</p>
                <p className="value" style={{ color: shortAPRHourly <= 0 || isNaN(shortAPRHourly) ? '#26A69A' : '#EF534F' }}>
                  {
                    shortAPRHourly.toFixed(5).replace('NaN', '0.00000').replace('Infinity', 'ထ') + '% Per Hour'
                  }
                </p>
              </Box>
            </ScrollMenu>
          </DesktopStatusInfos>
          <MobileStatusInfos>
          <Box className="index-info">
                <p className="title">Oracle Price</p>
                <p className="value">
                  {
                    oracleData[pairIndex]
                      ? (parseInt(oracleData[pairIndex].price) / 1e18).toPrecision(6)
                      : 'Loading...'
                  }
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Price Spread</p>
                <p className="value">
                  {
                    oracleData[pairIndex] != null
                      ? ((oracleData[pairIndex].spread as unknown as number) / 1e8).toFixed(3) + '%'
                      : '0.000%'
                  }
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Long Open Interest</p>
                <p className="value">
                  {
                    (oi?.longOi / 1e18).toFixed(0) + '/'
                  }
                  <span>{oi?.maxOi.toString() === '0' ? 'Unlimited' : (oi?.maxOi / 1e18).toString()}</span>
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Short Open Interest</p>
                <p className="value">
                  {
                    (oi?.shortOi / 1e18).toFixed(0) + '/'
                  }
                  <span>{oi?.shortOi.toString() === '0' ? 'Unlimited' : (oi?.maxOi / 1e18).toString()}</span>
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Open Fee</p>
                <p className="value">
                  {
                    (((Number(openFees?.daoFees) + Number(openFees?.burnFees) - (referral !== ethers.constants.AddressZero ? openFees?.referralFees/1e10 : 0))*(pairData?.feeMultiplier/1e10))/1e8).toFixed(3) + "%"
                  }
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Close Fee</p>
                <p className="value">
                  {
                    (((Number(closeFees?.daoFees) + Number(closeFees?.burnFees) - (referral !== ethers.constants.AddressZero ? closeFees?.referralFees/1e10 : 0))*(pairData?.feeMultiplier/1e10))/1e8).toFixed(3) + "%"
                  }
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Long Funding Fee</p>
                <p className="value" style={{ color: longAPRHourly <= 0 ? '#26A69A' : '#EF534F' }}>
                  {
                    longAPRHourly.toFixed(5).replace('NaN', '0').replace('Infinity', 'ထ') + '% Per Hour'
                  }
                </p>
              </Box>
              <Box className="index-info">
                <p className="title">Short Funding Fee</p>
                <p className="value" style={{ color: shortAPRHourly <= 0 ? '#26A69A' : '#EF534F' }}>
                  {
                    shortAPRHourly.toFixed(5).replace('NaN', '0').replace('Infinity', 'ထ') + '% Per Hour'
                  }
                </p>
              </Box>
          </MobileStatusInfos>
        </TradeWrapper>
      </Container>
    </TradeContainer>
  );
};

const TradeContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#18191D',
  // height: '63px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const TradeWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  maxWidth: '1440px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const KindOfToken = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  padding: '15px 15px 15px 0',
  cursor: 'pointer',
  borderRight: '1px solid #23262F',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'space-between',
    width: '100%',
    borderRight: 'none',
    borderBottom: '1px solid #23262F'
  },
  svg: {
    color: '#FABE3C'
  }
}));

const Tokens = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  '.token-name': {
    color: '#E5E3EC',
    fontWeight: '700',
    fontSize: '18px',
    lineHeight: '32px'
  },
  '.multi-value': {
    borderImage: 'linear-gradient(150deg, #3772FF 10%, #D737FF 100%)',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '4px',
    borderImageSlice: 1,
    height: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    span: {
      marginLeft: '4px',
      marginRight: '4px',
      fontWeight: '700',
      fontSize: '11px',
      lineHeight: '9px',
      background: '#FFFFFF',
      backgroundClip: 'text',
      textFillColor: 'transparent'
    }
  }
}));

const DesktopStatusInfos = styled(Box)(({ theme }) => ({
  height: '100%',
  width: 'calc(96vw - 206.2px)',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  },
  '.index-info': {
    padding: '0 11px',
    borderRight: '1px solid #23262F',
    '.title': {
      color: '#D2CEDE',
      fontSize: '10px',
      lineHeight: '12px',
      fontFamily: 'DMSans-Regular',
      whiteSpace: 'nowrap'
    },
    '.value': {
      fontSize: '12px',
      lineHeight: '16px',
      fontFamily: 'DMSans-Regular',
      margin: '3px 0',
      whiteSpace: 'nowrap',
      span: {
        color: 'rgba(229, 227, 236, 0.47)'
      }
    }
  }
}));

const MobileStatusInfos = styled(Box)(({ theme }) => ({
  padding: '15px',
  display: 'none',
  width: '100%',
  gridTemplateColumns: 'auto auto auto',
  [theme.breakpoints.down('md')]: {
    display: 'grid',
    gap: '1rem'
  },
  [theme.breakpoints.down('xs')]: {
    gridTemplateColumns: 'auto auto'
  },
  '.index-info': {
    maxHeight: '35px',
    padding: '0 11px',
    '.title': {
      color: '#D2CEDE',
      fontSize: '10px',
      lineHeight: '12px',
      fontFamily: 'DMSans-Regular',
      whiteSpace: 'nowrap'
    },
    '.value': {
      fontSize: '12px',
      lineHeight: '16px',
      fontFamily: 'DMSans-Regular',
      margin: '3px 0',
      whiteSpace: 'nowrap',
      span: {
        color: 'rgba(229, 227, 236, 0.47)'
      }
    }
  }
}));
