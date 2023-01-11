import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import { Container } from "src/components/Container"
import { VaultInput } from "src/components/Input";
import { DAISvg, LOGO } from "src/config/images";
import {LockOutlined, SwapHoriz , HelpOutline } from '@mui/icons-material'

export const Vault = () => {
    const [editState, setEditState] = useState({
        daiValue: 0,
        tigValue: 0,
        tigBalance: 0.7894,
        days: 18
    });
  const handleEditState = (prop: string, value: string | number | boolean) => {
    setEditState({ ...editState, [prop]: value });
  };
    return(
        <Container>
            <GovernanceContainer>
                <Wrapper>
                    <VaultCardGroup>
                        <VaultCard>
                            <VaultCardContainer>
                            <VaultCardTitle>
                                <Img src={DAISvg} alt="dai-svg" />
                                0.654398 DAI
                            </VaultCardTitle>
                            <VaultCardContent>  
                                Vault balance
                            </VaultCardContent>
                            </VaultCardContainer>
                        </VaultCard>
                        <VaultCard>
                            <VaultCardContainer>
                            <VaultCardTitle>
                                100%
                            </VaultCardTitle>
                            <VaultCardContent>  
                                Vault Percentage
                            </VaultCardContent>
                            </VaultCardContainer>
                        </VaultCard>
                        <VaultCard style={{ gridColumn: '1 / 3' }}>
                            <VaultCardContainer>
                            <VaultCardTitle>
                                0.4593149
                            </VaultCardTitle>
                            <VaultCardContent>  
                                TigUSD Supply
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
                        <LockButtonGroup>
                            <LockButton variant="outlined" borderColor="#3772FF">
                                <LockIcon style={{ color: "#3772FF" }} />
                                New Lock
                            </LockButton>
                            <LockButton variant="outlined" borderColor="#FFFFFF">
                                <LockIcon style={{ color: "#FFFFFF" }} />
                                My Locks
                            </LockButton>
                        </LockButtonGroup>
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
    alignItems: 'center'
}))

const Img = styled('img')(({ theme }) => ({
    width: "20px",
    height: '20px'
}))

const VaultCardContent = styled(Box)(({ theme }) => ({
    fontSize: '13px',
    lineHeight: "17px",
    color: "#777E90"
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
    width: '70px',
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
    borderColor: string;
}

const LockButton = styled(Button)<LockProps>(({ theme, borderColor }) => ({
    padding: '11px 21px',
    width: '150px',
    height: '40px',
    display: "flex",
    gap: '14px',
    borderColor: borderColor,
    textTransform: 'none',
    "&: hover": {
        borderColor: borderColor
    },
    [theme.breakpoints.down(390)]: {
        gap: "6px",
        fontSize: '11px'
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

const TigUsDMax = () => {
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