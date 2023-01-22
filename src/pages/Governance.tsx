import { useState, useEffect } from 'react';
import { Box, Button, FormControlLabel, FormGroup } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from 'src/components/Container';
import { OpenInNew } from '@mui/icons-material';
import { ArbiScanSvg, LOGO, PolygonSvg } from 'src/config/images';
import { Notification } from 'src/components/Notification';
import { InputField } from 'src/components/Input';
import { IconDropDownMenu } from 'src/components/Dropdown/IconDrop';
import { TigrisCheckBox } from 'src/components/CheckBox';
import { ethers } from 'ethers';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { getNetwork } from 'src/constants/networks';

declare const window: any
const { ethereum } = window;

const bridgeDict = [
  {
      name: "Polygon",
      icon: PolygonSvg,
      nft: "5DF98AA475D8815df7cd4fC4549B5c150e8505Be",
      chainId: 137,
      layerzero: 109
  },
  {
      name: "Arbitrum",
      icon: ArbiScanSvg,
      nft: "303c470c0e0342a1CCDd70b0a17a14b599FF1474",
      chainId: 42161,
      layerzero: 110
  }
]

const urls = {
  Arbitrum: {
    opensea: "https://opensea.io/collection/tigris-trade-arbi",
    treasury: "https://arbiscan.io/address/0xF416C2b41Fb6c592c9BA7cB6B2f985ed593A51d7"
  },
  Polygon: {
    opensea: "https://opensea.io/collection/tigris-trade",
    treasury: "https://polygonscan.com/address/0x4f7046f36B5D5282A94cB448eAdB3cdf9Ff2b051"
  },
  "Arbitrum Görli": {
    opensea: "https://opensea.io/collection/tigris-trade-arbi",
    treasury: "https://arbiscan.io/address/0xF416C2b41Fb6c592c9BA7cB6B2f985ed593A51d7"
  },
  dune: "https://dune.com/Henrystats/tigris-overview"
}

export const Governance = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [currentNetwork, setCurrentNetwork] = useState(getNetwork(chain?.id));

  const defaultBridge = {
    name: currentNetwork.name,
    icon: currentNetwork.icon,
    nft: (currentNetwork.addresses.govnft).substring(2),
    chainId: currentNetwork.network_id,
    layerzero: currentNetwork.layerzero
  }

  const [editState, setEditState] = useState({
    fromData: defaultBridge,
    toData: bridgeDict[1]
  });

  const handleEditState = (prop: string, value: any ) => {
    if (prop === "fromData") {
      switchNetwork?.(value.chainId);
    } else {
      setEditState({ ...editState, [prop]: value });
      if (value.chainId === editState.fromData.chainId) {
        setBridgeError(true);
      } else {
        setBridgeError(false);
      }
    }
  }

  useSwitchNetwork({
    onSuccess(data) {
      const cNetwork = getNetwork(data.id);
      setCurrentNetwork(cNetwork);
      setEditState({ ...editState, "fromData": {
        name: cNetwork.name,
        icon: cNetwork.icon,
        nft: (cNetwork.addresses.govnft).substring(2),
        chainId: cNetwork.network_id,
        layerzero: cNetwork.layerzero
      }});
      if (editState.toData.chainId === cNetwork.network_id) {
        setBridgeError(true);
      } else {
        setBridgeError(false);
      }
    }
  });

  useEffect(() => {
    const cNetwork = getNetwork(chain?.id);
    setCurrentNetwork(cNetwork);
    setEditState({...editState, "fromData": {
      name: cNetwork.name,
      icon: cNetwork.icon,
      nft: (cNetwork.addresses.govnft).substring(2),
      chainId: cNetwork.network_id,
      layerzero: cNetwork.layerzero
    }});
    if (editState.toData.chainId === editState.fromData.chainId) {
      setBridgeError(true);
    } else {
      setBridgeError(false);
    }
    setSelectedNfts([]);
  }, [chain, address]);

  useEffect(() => {
    getInfo();
    if (editState.toData.chainId === editState.fromData.chainId) {
      setBridgeError(true);
    } else {
      setBridgeError(false);
    }
  }, [currentNetwork, address]);

  const [number, setNumber] = useState(1);
  const [available, setAvailable] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [govSupply, setGovSupply] = useState(0);
  const [pending, setPending] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isSpendingAllowed, setSpendingAllowed] = useState(false);
  const [isMaxBridgeError, setIsMaxBridgeError] = useState(false);

  const [ownedNfts, setOwnedNfts] = useState<any[]>([]);
  const [selectedNfts, setSelectedNfts] = useState<any[]>([]);

  const [isBridgeError, setBridgeError] = useState(false);

  async function getInfo() {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const nftsaleContract = new ethers.Contract(currentNetwork.addresses.nftsale, currentNetwork.abis.nftsale, provider);
    const govnftContract = new ethers.Contract(currentNetwork.addresses.govnft, currentNetwork.abis.govnft, provider);

    if (currentNetwork.network_id !== 137 ) {
        setOwnedNfts(await govnftContract.balanceIds(address));
    } else {
        setOwnedNfts([]);
        fetch('https://tigristrade.info/stats/user_nfts/'+address)
        .then(response => {
            response.json().then(data => {
                const ownedNFTs = [];
                for(let i=0; i<data.nfts.length; i++) ownedNFTs.push(data.nfts[i].id);
                setOwnedNfts(ownedNFTs);
            });
        });
    }

    const av = await nftsaleContract.available();
    setAvailable(av);

    const supply = await govnftContract.totalSupply();
    const contractBalance = await govnftContract.balanceOf(currentNetwork.addresses.nftsale);
    setGovSupply(supply-contractBalance);

    const pending = await govnftContract.pending(address, currentNetwork.addresses.tigusd);
    setPending(pending);
  }

  function handleCheckbox(id: number) {
    if (!selectedNfts.includes(id)) {
        selectedNfts.push(id);
    } else {
        const index = selectedNfts.indexOf(id);
        if (index > -1) {
            selectedNfts.splice(index, 1);
        }
    }
    if (selectedNfts.length > 25) {
        setIsMaxBridgeError(true);
    } else {
        setIsMaxBridgeError(false);
    }
  }

  return (
    <Container>
      <GovernanceContainer>
        <Wrapper>
          <CardGroup>
            <Card>
              <CardValue>$0.00</CardValue>
              <CardMedia>
                24h trading volume
              </CardMedia>
              <CardMedia sx={{ color: '#3772FF', cursor: 'pointer', fontSize: '14px' }} onClick={() => window.open(urls.dune, '_blank')}>
                Advanced Stats
                <OpenInNew sx={{ width: '15px', height: '15px' }} />
              </CardMedia>
            </Card>
            <Card>
              <CardValue>{(govSupply/1).toString()} / 606</CardValue>
              <CardMedia>Circulating supply on {currentNetwork.name}</CardMedia>
              <CardMedia sx={{ color: '#3772FF', cursor: 'pointer', fontSize: '14px' }} onClick={() => window.open(window.open((urls[currentNetwork.name as keyof typeof urls] as any).opensea, '_blank'), '_blank')}>
                OpenSea
                <OpenInNew sx={{ width: '15px', height: '15px' }} />
              </CardMedia>
            </Card>
            <Card>
              <CardValue>$100,000.00</CardValue>
              <CardMedia>{currentNetwork.name}</CardMedia>
              <CardMedia sx={{ color: '#3772FF', cursor: 'pointer' }} onClick={() => window.open(window.open((urls[currentNetwork.name as keyof typeof urls] as any).treasury, '_blank'), '_blank')}>
                Treasury Balance
                <OpenInNew sx={{ width: '15px', height: '15px' }} />
              </CardMedia>
            </Card>
          </CardGroup>
          <GovernanceAction>
            <NFTSaleSection>
              <SectionHeader>
                <img src={LOGO} alt="logo" width={30} height={30} />
                Governance NFT SALE
              </SectionHeader>
              <SectionContent>
                <Notification content="100% of revenue is distributed to Governance NFTs holders. NFTs will be minted and sold in batches only when the project needs funding." />
                <NFTDetails>
                  <NFTDetailItem>
                    <ItemTitle>Max Supply</ItemTitle>
                    <ItemValue>10,000</ItemValue>
                  </NFTDetailItem>
                  <NFTDetailItem>
                    <ItemTitle>Network</ItemTitle>
                    <ItemValue>
                      <img src={ArbiScanSvg} alt="arbitrum-icon" width={18} height={18} />
                      <span style={{ color: '#808183' }}>Arbitrum</span>
                    </ItemValue>
                  </NFTDetailItem>
                  <NFTDetailItem>
                    <ItemTitle>NFT Price</ItemTitle>
                    <ItemValue>
                      650 <span style={{ color: '#808183' }}>USDT</span>
                    </ItemValue>
                  </NFTDetailItem>
                  <NFTDetailItem>
                    <ItemTitle>Available NFTs</ItemTitle>
                    <ItemValue>
                      {available/1} <span style={{ color: '#808183' }}>/ 200</span>
                    </ItemValue>
                  </NFTDetailItem>
                  <NumberController>
                    <ItemTitle>Number</ItemTitle>
                    <InputAction>
                      <InputField
                        type="text"
                        name="number"
                        placeholder="0"
                        value={number.toString() === "NaN" ? 0 : number.toString()}
                        setValue={(v: string) => setNumber(parseInt(v.replace(/[^0-9]/g, "")))}
                      />
                      <NumberPlusButton onClick={() => {number.toString() === '' ? setNumber(1) : setNumber(number + 1)}}>
                        {' '}
                        +{' '}
                      </NumberPlusButton>
                      <NumberMinusButton onClick={() => {if (number > 1) setNumber(number - 1)}}>
                        {' '}
                        -{' '}
                      </NumberMinusButton>
                    </InputAction>
                  </NumberController>
                  <NFTDetailItem>
                    <ItemTitle>Total price</ItemTitle>
                    <ItemValue>
                      650 <span style={{ color: '#808183' }}>USDT</span>
                    </ItemValue>
                  </NFTDetailItem>
                  <PrimaryButton>Approve</PrimaryButton>
                </NFTDetails>
              </SectionContent>
            </NFTSaleSection>
            <ClaimBridgeSection>
              <FeeCard>
                <FeeCardTitle>Fee distribution</FeeCardTitle>
                <FeeCardContent>
                  <img src={LOGO} alt="logo" width={30} height={30} />
                  {(pending/1e18).toFixed(2)} tigUSD
                </FeeCardContent>
                <PrimaryButton>Claim</PrimaryButton>
              </FeeCard>
              <BridgeLabel>Bridge</BridgeLabel>
              <BridgeAction>
                <BridgeActionLabel>From</BridgeActionLabel>
                <IconDropDownMenu
                  arrayData={bridgeDict}
                  name="fromData"
                  state={editState.fromData}
                  setState={handleEditState}
                />
                <BridgeActionLabel>To</BridgeActionLabel>
                <IconDropDownMenu
                  arrayData={bridgeDict}
                  name="toData"
                  state={editState.toData}
                  setState={handleEditState}
                />
                <NftIDCheckContainer>
                  <FormGroup>
                    {
                      (ownedNfts).map((id:number) => (
                        <FormControlLabel
                          key={id}
                          control={<TigrisCheckBox defaultChecked={false} onChange={() => handleCheckbox(id)}/>}
                          label={<CheckBoxLabel primary="GOV NFT" secondary={"#" + id.toString()} />}
                        />
                      ))
                    }
                  </FormGroup>
                </NftIDCheckContainer>
                {
                  isBridgeError ?
                  <ErrorButton>Bridge networks must be different</ErrorButton> :
                  isMaxBridgeError ?
                  <ErrorButton>Max 25 NFTs</ErrorButton> :
                  <PrimaryButton>Bridge</PrimaryButton>
                }
              </BridgeAction>
            </ClaimBridgeSection>
          </GovernanceAction>
        </Wrapper>
      </GovernanceContainer>
    </Container>
  );
};

interface CheckBoxLabelProps {
  primary: string;
  secondary: string;
}

const CheckBoxLabel = (props: CheckBoxLabelProps) => {
  const { primary, secondary } = props;
  return (
    <LabelContainer>
      {primary}
      <span style={{ color: '#585c64' }}> {secondary}</span>
    </LabelContainer>
  );
};

const LabelContainer = styled(Box)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '24px'
}));

const GovernanceContainer = styled(Box)(({ theme }) => ({
  padding: '70px 0',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center'
}));

const Wrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  alignItems: 'center',
  maxWidth: '960px'
}));

const CardGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  width: '100%',
  [theme.breakpoints.down(768)]: {
    flexDirection: 'column'
  }
}));

const Card = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '120px',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  background: '#18191D'
}));

const CardValue = styled(Box)(({ theme }) => ({
  fontSize: '25px',
  lineHeight: '33px',
  fontWeight: '500',
  marginBottom: '-5px'
}));

const CardMedia = styled(Box)(({ theme }) => ({
  fontSize: '15px',
  lineHeight: '20px',
  fontWeight: '500',
  color: '#777E90',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '-3px'
}));

const GovernanceAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: '12px',
  [theme.breakpoints.down(768)]: {
    flexDirection: 'column-reverse'
  }
}));

const NFTSaleSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  minWidth: '636px',
  [theme.breakpoints.down('lg')]: {
    minWidth: '343px'
  },
  [theme.breakpoints.down(768)]: {
    minWidth: '320px'
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '9px 27px',
  display: 'flex',
  gap: '17px',
  alignItems: 'center',
  fontSize: '12px',
  lineHeight: '20px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontWeight: '700',
  backgroundColor: '#18191D'
}));

const SectionContent = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '22px 27px',
  backgroundColor: '#18191D'
}));

const NFTDetails = styled(Box)(({ theme }) => ({
  paddingTop: '27px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
}));

const NFTDetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between'
}));

const ItemTitle = styled(Box)(({ theme }) => ({
  color: '#B1B5C3',
  fontSize: '12px',
  lineHeight: '20px',
  fontWeight: '400'
}));

const ItemValue = styled(Box)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: '400',
  display: 'flex',
  gap: '5px',
  alignItems: 'center'
}));

const NumberController = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: '24px',
  alignItems: 'center',
  padding: '20px 0'
}));

const InputAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '13px'
}));

const NumberPlusButton = styled(Button)(({ theme }) => ({
  minWidth: '36px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#3772FF',
  borderRadius: '5px',
  '&:hover': {
    backgroundColor: '#3772FF'
  }
}));

const NumberMinusButton = styled(Button)(({ theme }) => ({
  minWidth: '36px',
  maxHeight: '36px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'none',
  borderRadius: '5px',
  color: '#3772FF',
  border: '2px solid #3772FF',
  '&:hover': {
    backgroundColor: 'none'
  }
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#3772FF',
  borderRadius: '4px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#3772FF'
  }
}));

const ErrorButton = styled(Button)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#2F3135',
  borderRadius: '4px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#2F3135'
  }
}));

const ClaimBridgeSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
}));

const FeeCard = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '172px',
  padding: '27px 12px 18px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  backgroundColor: '#18191D',
  justifyContent: 'space-between'
}));

const FeeCardTitle = styled(Box)(({ theme }) => ({
  fontWeight: '500',
  fontSize: '15px',
  lineHeight: '20px',
  color: '#777E90',
  paddingLeft: '45px'
}));

const FeeCardContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '15px',
  fontSize: '25px',
  lineHeight: '33px',
  paddingLeft: '45px'
}));

const BridgeLabel = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '50px',
  padding: '15px 12px',
  fontSize: '12px',
  fontWeight: '700',
  lineHeight: '20px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  backgroundColor: '#18191D',
  marginTop: '12px'
}));

const BridgeAction = styled(Box)(({ theme }) => ({
  padding: '0 12px 15px 12px',
  width: '100%',
  backgroundColor: '#18191D',
  marginTop: '7px'
}));

const BridgeActionLabel = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: '20px',
  color: '#B1B5C3',
  padding: '15px 0'
}));

const NftIDCheckContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#141416',
  borderRadius: '5px',
  padding: '16px',
  margin: '18px 0',
  minHeight: '67px'
}));
