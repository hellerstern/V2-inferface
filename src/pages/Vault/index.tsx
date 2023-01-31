import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import { Container } from "src/components/Container"
import { VaultInput } from "src/components/Input";
import { DAISvg, LOGO } from "src/config/images";
import {LockOutlined, SwapHoriz , HelpOutline, MoreHoriz } from '@mui/icons-material'
import { ClaimModal } from "src/components/Modal/VaultClaimModal";

const TigUSDList = () => {
    return(
        <TigUSDListContainer>
            <Img src={LOGO} alt='tigusd-logo' />
            TigUSD
        </TigUSDListContainer>
    )
}

const TigUSDListContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: "11px",
    fontSize: '12px',
    lineHeight: '24px',
    alignItems: 'center',
    color: "#B1B5C3"
}))

const Img = styled('img')(({ theme }) => ({
    width: "20px",
    height: '20px'
}))

interface LockArrProps {
    id: number;
    stakeItem: React.ReactNode;
    yourStake: string;
    dateEnd: string;
    projectApr: string;
    shareAmount: string;
    pendingRewards: string;
}

// const LockArr: LockArrProps[] = [];

const LockArr: LockArrProps[] = [
    {
        id: 1,
        stakeItem: <TigUSDList />,
        yourStake: "0.49031 tigUSD",
        dateEnd: "24 Dec, 2022",
        projectApr: "0.453984%",
        shareAmount: "1.3478420",
        pendingRewards: "0.39572498"
    },
    {
        id: 2,
        stakeItem: <TigUSDList />,
        yourStake: "0.49031 tigUSD",
        dateEnd: "24 Dec, 2022",
        projectApr: "0.453984%",
        shareAmount: "1.3478420",
        pendingRewards: "0.39572498"
    },
    {
        id: 3,
        stakeItem: <TigUSDList />,
        yourStake: "0.49031 tigUSD",
        dateEnd: "24 Dec, 2022",
        projectApr: "0.453984%",
        shareAmount: "1.3478420",
        pendingRewards: "0.39572498"
    },
    {
        id: 4,
        stakeItem: <TigUSDList />,
        yourStake: "0.49031 tigUSD",
        dateEnd: "24 Dec, 2022",
        projectApr: "0.453984%",
        shareAmount: "1.3478420",
        pendingRewards: "0.39572498"
    },
    {
        id: 5,
        stakeItem: <TigUSDList />,
        yourStake: "0.49031 tigUSD",
        dateEnd: "24 Dec, 2022",
        projectApr: "0.453984%",
        shareAmount: "1.3478420",
        pendingRewards: "0.39572498"
    },
    {
        id: 6,
        stakeItem: <TigUSDList />,
        yourStake: "0.49031 tigUSD",
        dateEnd: "24 Dec, 2022",
        projectApr: "0.453984%",
        shareAmount: "1.3478420",
        pendingRewards: "0.39572498"
    },
    {
        id: 7,
        stakeItem: <TigUSDList />,
        yourStake: "0.49031 tigUSD",
        dateEnd: "24 Dec, 2022",
        projectApr: "0.453984%",
        shareAmount: "1.3478420",
        pendingRewards: "0.39572498"
    },
    {
        id: 8,
        stakeItem: <TigUSDList />,
        yourStake: "0.49031 tigUSD",
        dateEnd: "24 Dec, 2022",
        projectApr: "0.453984%",
        shareAmount: "1.3478420",
        pendingRewards: "0.39572498"
    }
]

export const Vault = () => {
    const [editState, setEditState] = useState({
        daiValue: 0,
        tigValue: 0,
        tigBalance: 0.7894,
        days: 18,
        isMyLock: false
    });
  const handleEditState = (prop: string, value: string | number | boolean) => {
    setEditState({ ...editState, [prop]: value });
  };
  const [ isModalOpen, setModalOpen ] = useState(false);

    return(
        <Container>
            <GovernanceContainer>
                <Wrapper>
                    <VaultCardGroup>
                        <VaultCard>
                            <VaultCardContainer>
                                <VaultCardTitle>
                                    $100,000.00
                                </VaultCardTitle>
                                <VaultCardContent>  
                                    Vault Balance
                                </VaultCardContent>
                            </VaultCardContainer>
                        </VaultCard>
                        <VaultCard>
                            <VaultCardContainer>
                                <VaultCardTitle>
                                    100.00%
                                </VaultCardTitle>
                                <VaultCardContent>  
                                    Vault Collateralization
                                </VaultCardContent>
                            </VaultCardContainer>
                        </VaultCard>
                        <VaultCard style={{ gridColumn: '1 / 3' }}>
                            <VaultCardContainer>
                                <VaultCardTitle>
                                    100,000.00
                                </VaultCardTitle>
                                <VaultCardContent>  
                                    tigUSD Supply
                                </VaultCardContent>
                            </VaultCardContainer>
                        </VaultCard>
                    </VaultCardGroup>
                    <VaultLabel>USD VAULT</VaultLabel>
                    <VaultSection>
                        <VaultInputContainer>
                            <VaultInputWrapper>
                                <VaultInput type="number" name="daiValue" placeholder="0" value={editState.daiValue} setValue={handleEditState} component={<Max>Max</Max>} />
                                <VaultInputLabel>
                                    <VaultInputPrimary>Asset balance</VaultInputPrimary>
                                    <VaultInputSecondary>
                                        <img src={DAISvg} alt="dai-svg" />
                                        0.57489DAI
                                    </VaultInputSecondary>
                                </VaultInputLabel>
                            </VaultInputWrapper>
                            <SwapIcon sx={{ marginTop: '-36px' }} />
                            <VaultInputWrapper>
                                <VaultInput type="number" name="tigValue" placeholder="0" value={editState.tigValue} setValue={handleEditState} component={<TigUSD />} />
                                <VaultInputLabel>
                                    <VaultInputPrimary>Asset balance</VaultInputPrimary>
                                    <VaultInputSecondary>
                                        0.00 TigUSD
                                    </VaultInputSecondary>
                                </VaultInputLabel>
                            </VaultInputWrapper>
                        </VaultInputContainer>
                        <ApproveButton>
                            Approve
                        </ApproveButton>
                    </VaultSection>
                    <VaultLabel>TigUSD STAKING</VaultLabel>
                    <VaultSection>
                        <VaultButtonGroup>
                            <LockButtonGroup>
                                <LockButton variant="outlined" bcolor={editState.isMyLock ? "#FFFFFF" : "#3772FF" } onClick={() => handleEditState("isMyLock", false)}>
                                    <LockIcon style={{ color: editState.isMyLock ? "#FFFFFF" : "#3772FF" }} />
                                    New Lock
                                </LockButton>
                                <LockButton variant="outlined" bcolor={editState.isMyLock ? "#3772FF" : "#FFFFFF"} onClick={() => handleEditState("isMyLock", true)}>
                                    <LockIcon style={{ color: editState.isMyLock ? "#3772FF" : "#FFFFFF" }} />
                                    My Locks
                                </LockButton> 
                            </LockButtonGroup>
                            { editState.isMyLock &&
                                <ClaimRewardButton variant="outlined">
                                    Claim all rewards 
                                </ClaimRewardButton>
                            }
                        </VaultButtonGroup>
                        { !editState.isMyLock ?
                            <>
                                <VaultInputBox>
                                    <VaultInput type="number" name="tigBalance" placeholder="0" value={editState.tigBalance} setValue={handleEditState} component={<TigUsDMax />} />
                                    <VaultInputLabel>
                                        <VaultInputPrimary>Asset balance</VaultInputPrimary>
                                        <VaultInputSecondary>
                                            0.57489 TigUSD
                                        </VaultInputSecondary>
                                    </VaultInputLabel>
                                </VaultInputBox>
                                <VaultInputBox> 
                                    <VaultInput type="number" name="tigBalance" placeholder="0" value={editState.tigBalance} setValue={handleEditState} component={<Max>Max</Max>} />
                                    <VaultInputLabel>
                                        <VaultInputPrimary>7-365 days Max</VaultInputPrimary>
                                    </VaultInputLabel>
                                </VaultInputBox>
                                <VaultInputBox> 
                                    <VaultInputLabel>
                                        <VaultInputPrimary>Your Stake</VaultInputPrimary>
                                        <VaultInputSecondary>
                                            0.49031 tigUSD
                                        </VaultInputSecondary>
                                    </VaultInputLabel>
                                    <VaultInputLabel>
                                        <VaultInputPrimary>Total Staked <HelpOutline sx={{ width: '15px',  height: '15px' }} /></VaultInputPrimary>
                                        <VaultInputSecondary>
                                            0.49031 tigUSD
                                        </VaultInputSecondary>
                                    </VaultInputLabel>
                                    <VaultInputLabel>
                                        <VaultInputPrimary>Share amount <HelpOutline sx={{ width: '15px',  height: '15px' }} /></VaultInputPrimary>
                                        <VaultInputSecondary>
                                            0.49031 tigUSD
                                        </VaultInputSecondary>
                                    </VaultInputLabel>
                                    <VaultInputLabel>
                                        <VaultInputPrimary>Projected APR %</VaultInputPrimary>
                                        <VaultInputSecondary>
                                            0.49031 tigUSD
                                        </VaultInputSecondary>
                                    </VaultInputLabel>
                                    <VaultInputLabel> 
                                        <VaultInputPrimary>Total shares</VaultInputPrimary>
                                        <VaultInputSecondary>
                                            0.49031 tigUSD
                                        </VaultInputSecondary>
                                    </VaultInputLabel>
                                </VaultInputBox>
                                <ApproveTigUSDButton>
                                    Approve tigUSD
                                </ApproveTigUSDButton>
                            </> : 
                            LockArr.length === 0 ? <NothingLocks />:
                            <>
                                <StakingList>
                                    <StakingListItem type="header" stakeItem="Staking item" yourStake="Your stake" dateEnd="Date end" projectApr="Projected APR %" shareAmount="Share amount" pendingRewards="Pending rewards" />
                                    {
                                        LockArr.map((item, index) => (
                                            <StakingList key={index}>
                                                <StakingListItem type="item" stakeItem={item.stakeItem} yourStake={item.yourStake} dateEnd={item.dateEnd} projectApr={item.projectApr} shareAmount={item.shareAmount} pendingRewards={item.pendingRewards} onClick={() => setModalOpen(true)} />
                                                <MobileStakingListitem idx={item.id} stakeItem={item.stakeItem} yourStake={item.yourStake} dateEnd={item.dateEnd} projectApr={item.projectApr} shareAmount={item.shareAmount} pendingRewards={item.pendingRewards} onClick={() => setModalOpen(true)} />
                                            </StakingList>
                                        ))
                                    }
                                </StakingList>
                            </>
                        }
                        <ClaimModal isState={isModalOpen} setState={setModalOpen} />
                    </VaultSection>
                </Wrapper>
            </GovernanceContainer>
        </Container>
    )
}

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
  gap: '8px',
  alignItems: 'center',
  maxWidth: '960px'
}));

const VaultCardGroup = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: "center",
    gap: '6px',
    width: '100%',
    [theme.breakpoints.down(690)]: {
        display: 'grid',
        gridTemplateColumns: "repeat(1, 2fr)"
    }
})) 

const SwapIcon = styled(SwapHoriz)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        transform: 'rotate(90deg)'
    }
}))

const VaultCard = styled(Box)(({ theme }) => ({
    padding: "27px 29px",
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    background: "#18191D"
}))

const VaultCardContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
}))

const VaultCardTitle = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: "11px",
    fontSize: "20px",
    lineHeight: '26px',
    alignItems: 'center',
    justifyContent: 'center'
}))

const VaultCardContent = styled(Box)(({ theme }) => ({
    fontSize: '13px',
    lineHeight: "17px",
    color: "#777E90",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}))

const VaultLabel = styled(Box)(({ theme }) => ({
    padding: '15px 27px',
    fontSize: "12px",
    lineHeight: '20px',
    color: "#FFFFFF",
    width: '100%',
    backgroundColor: "#18191D",
    letterSpacing: "0.1em"
}))

const VaultSection = styled(Box)(({ theme }) => ({
    padding: "25px 27px",
    backgroundColor: "#18191D",
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px'
}))

const Max = styled(Box)(({ theme }) => ({
    minWidth: '70px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18191D',
    borderRadius: '2px',
    fontSize: '12px',
    lineHeight: '20px',
    color: "#777E90",
    cursor: 'pointer'
}))

const VaultInputContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        gap: '38px'
    }
}))

const VaultInputWrapper = styled(Box)(({ theme }) => ({
    width: '324px',
    display: 'flex',
    flexDirection: 'column',
    gap: '13px',
    [theme.breakpoints.down('md')]: {
        width: '100%'
    }
}))

const TigUSD = () => {
    return(
        <TigUSDContainer>
            <Img src={LOGO} alt='tigusd-logo' />
            tigUSD
        </TigUSDContainer>
    )
}

const TigUSDContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: "7px",
    fontSize: '12px',
    lineHeight: '20px',
    fontWeight: "700",
    alignItems: 'center',
    color: "#FFFFFF"
}))

const VaultInputLabel = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between'
}))

const VaultInputPrimary = styled(Box)(({ theme }) => ({
    color: "#B1B5C3",
    fontSize: '12px',
    lineHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
}))

const VaultInputSecondary = styled(Box)(({ theme }) => ({
    fontSize: '14px',
    lineHeight: "24px",
    color: "rgba(255, 255, 255, 0.45)",
    display: 'flex',
    gap: "16px",
    alignItems: 'center'
}))

const ApproveButton = styled(Button)(({ theme }) => ({
    width: '100%',
    height: '40px',
    backgroundColor: "#3772FF",
    border: "1px solid #3772FF",
    borderRadius: '4px',
    textTransform: "none",
    "&: hover": {
        backgroundColor: "#3772FF"
    }
}))

interface LockProps {
    bcolor: string;
}

const LockButton = styled(Button)<LockProps>(({ theme, bcolor }) => ({
    padding: '11px 21px',
    width: '150px',
    height: '40px',
    display: "flex",
    gap: '14px',
    borderColor: bcolor,
    textTransform: 'none',
    "&: hover": {
        borderColor: bcolor
    },
    [theme.breakpoints.down(640)]: {
        width: '100%'
    },
    [theme.breakpoints.down(390)]: {
        gap: "6px",
        fontSize: '11px'
    }
}))

const ClaimRewardButton = styled(Button)(({ theme }) => ({
    padding: '11px 21px',
    width: '180px',
    height: '40px',
    display: "flex",
    gap: '14px',
    borderColor: "#FFFFFF",
    textTransform: 'none',
    "&: hover": {
        borderColor: "#FFFFFF"
    },
    [theme.breakpoints.down(640)]: {
        width: "100%"
    }
}))

const LockIcon = styled(LockOutlined)(({ theme }) => ({
    [theme.breakpoints.down(390)]: {
        width: '17px',
        height: '17px'
    }
}))

const LockButtonGroup = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '16px'
}))

export const TigUsDMax = () => {
    return(
        <TigUsDMaxContainer>
            <TigUSD />
            <Max>Max</Max>
        </TigUsDMaxContainer>
    )
}

const TigUsDMaxContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '11px'
}))

const VaultInputBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '13px'
}))

const ApproveTigUSDButton = styled(Button)(({ theme }) => ({
     width: '100%',
    height: '40px',
    backgroundColor: "none",
    border: "1px solid #3772FF",
    borderRadius: '4px',
    textTransform: "none",
    "&: hover": {
        backgroundColor: "none"
    }
}))

const VaultButtonGroup = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down(640)]: {
        flexDirection: 'column',
        gap: "14px"
    }
}))

const StakingList = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: "7px"
}))

interface StakingProps {
    type: string;
    stakeItem: React.ReactNode | string;
    yourStake: string;
    dateEnd: string;
    projectApr: string;
    shareAmount: string;
    pendingRewards: string;
    onClick?: () => void;
}

const StakingListItem = (props: StakingProps) => {
    const { type, stakeItem, yourStake, dateEnd, projectApr, shareAmount, pendingRewards, onClick } = props;
    return(
        <StakingListItemContainer type={type} onClick={onClick}>
            <StakeListItem width={90}>{stakeItem}</StakeListItem>
            <StakeListItem width={110}>{yourStake}</StakeListItem>
            <StakeListItem width={110}>{dateEnd}</StakeListItem>
            <StakeListItem width={110}>{projectApr}</StakeListItem>
            <StakeListItem width={110}>{shareAmount}</StakeListItem>
            <StakeListItem width={110}>{pendingRewards}</StakeListItem>
            <StakeListItem width={30}>{type !== 'header' && <BlaBox><MoreHoriz /></BlaBox>}</StakeListItem> 
        </StakingListItemContainer>
    )
}

interface StakeContainerProps {
    type: string;
}

const StakingListItemContainer = styled(Box)<StakeContainerProps>(({ theme, type }) => ({
    borderRadius: '5px',
    backgroundColor: type !== "header" ? "#23262F" : "none",
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    justifyContent: "space-between",
    [theme.breakpoints.down(768)]: {
        display: 'none'
    }
}))

const StakeListItem = styled(Box)(({ theme }) => ({
    fontSize: "12px",
    lineHeight: "24px",
    fontWeight: "400",
    color: "#B1B5C3",
    textAlign: 'left'
}))

const BlaBox = styled(Box)(({ theme }) => ({
    width: '24px',
    height: "24px",
    borderRadius: '3px',
    backgroundColor: "#18191D",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
}))

interface MobileStakingProps {
    idx: number;
    stakeItem: React.ReactNode | string;
    yourStake: string;
    dateEnd: string;
    projectApr: string;
    shareAmount: string;
    pendingRewards: string;
    onClick?: () => void;
}

const MobileStakingListitem = (props: MobileStakingProps) => {
    const { idx, stakeItem, yourStake, dateEnd, projectApr, shareAmount, pendingRewards, onClick } = props;
    return(
        <MobileStakingListitemContainer onClick={onClick}>
            <MobileStakingListHeader>
                <MyLockIdx>My lock {idx}</MyLockIdx>
                <BlaBox><MoreHoriz /></BlaBox>
            </MobileStakingListHeader>
            <MobileStakingListBody>
                <MobileStakingListItem>
                    <ItemTitle>Staking item</ItemTitle>
                    <ItemContent>{stakeItem}</ItemContent>
                </MobileStakingListItem>
                <MobileStakingListItem>
                    <ItemTitle>Your Stake</ItemTitle>
                    <ItemContent>{yourStake}</ItemContent>
                </MobileStakingListItem>
                <MobileStakingListItem>
                    <ItemTitle>Date ended</ItemTitle>
                    <ItemContent>{dateEnd}</ItemContent>
                </MobileStakingListItem>
                <MobileStakingListItem>
                    <ItemTitle>Project APR %</ItemTitle>
                    <ItemContent>{projectApr}</ItemContent>
                </MobileStakingListItem>
                <MobileStakingListItem>
                    <ItemTitle>Share Amount</ItemTitle>
                    <ItemContent>{shareAmount}</ItemContent>
                </MobileStakingListItem>
                <MobileStakingListItem>
                    <ItemTitle>Pending rewards </ItemTitle>
                    <ItemContent>{pendingRewards}</ItemContent>
                </MobileStakingListItem>
            </MobileStakingListBody>
        </MobileStakingListitemContainer>
    )
}

const MobileStakingListitemContainer = styled(Box)(({ theme }) => ({
    display: 'none',
    flexDirection: "column",
    backgroundColor: "#23262F",
    borderRadius: '5px',
    padding: "19px 15px",
    gap: '22px',
    cursor: 'pointer',
    [theme.breakpoints.down(768)]: {
        display: 'flex'
    }
}))

const MobileStakingListHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}))

const MobileStakingListItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}))

const MobileStakingListBody = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: "17px"
}))

const MyLockIdx = styled(Box)(({ theme }) => ({
    fontSize: "12px",
    lineHeight: '24px',
    color: "#FFFFFF"
}))

const ItemTitle = styled(Box)(({ theme }) => ({
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '20px',
    color: "#777E90"
}))

const ItemContent = styled(Box)(({ theme }) => ({
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '24px',
    color: "#FFFFFF"
}))

const NothingLocks = () => {
    return(
        <NothingLocksContainer>
            <NothingLocksLabel>You don`t have any locks</NothingLocksLabel>
            <NothingLocksContent>When you will create a Lock , you'll see it here. Time to get to work.</NothingLocksContent>
            <CreateFirstLockButton variant="outlined">
                Create first lock
            </CreateFirstLockButton>
        </NothingLocksContainer>
    )
}

const NothingLocksContainer = styled(Box)(({ theme }) => ({
    background: "linear-gradient(180deg, #141416 0%, rgba(20, 20, 22, 0.02) 75.18%)",
    borderRadius: "8px",
    display: 'flex',
    width: '100%',
    height: '290px',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: "19px",
    padding: '38px'
}))

const NothingLocksLabel = styled(Box)(({ theme }) => ({
    fontWeight: '700',
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: "0.1em",
    textTransform : "uppercase",
    color: "#FFFFFF",
    [theme.breakpoints.down(390)]: {
        fontSize: '11px'
    }
}))

const NothingLocksContent = styled(Box)(({ theme }) => ({
    fontWeight: '400',
    fontSize: '15px',
    lineHeight: '24px',
    color: "#B1B5C3",
    textAlign: 'center',
    [theme.breakpoints.down(390)]: {
        fontSize: '11px'
    }
}))

const CreateFirstLockButton = styled(Button)(({ theme }) => ({
    padding: '11px 21px',
    width: '180px',
    height: '40px',
    display: "flex",
    gap: '14px',
    borderColor: "#FFFFFF",
    textTransform: 'none',
    "&: hover": {
        borderColor: "#FFFFFF"
    }
}))