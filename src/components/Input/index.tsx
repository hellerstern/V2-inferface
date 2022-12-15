import { Box, Slider } from '@mui/material';
import { styled } from '@mui/system';
import { useState, useEffect, useRef } from 'react';

interface InputProps {
  label: string;
  value: number;
  unit?: string;
  setValue: (value: any) => void;
}

interface containerProps {
  visited: boolean;
}

export const TigrisSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#6513E2' : '#6513E2',
  height: 2,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 16,
    width: 16,
    backgroundColor: '#fff'
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 14,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none'
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000'
    }
  },
  '& .MuiSlider-markLabel': {
    fontSize: '11px'
  },
  '& .MuiSlider-track': {
    border: 'none',
    backgroundImage: "linear-gradient(.25turn, #910ABC, #0249DD)"
  },
  '& .MuiSlider-rail': {
    opacity: 1,
    backgroundColor: '#353945'
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: '#bfbfbf'
    }
  }
}));

export const TigrisInput = (props: InputProps) => {
  const { label, value, unit, setValue } = props;
  const inputRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const [isVisit, setVisit] = useState(false);
  const handleClickOutside = (event: React.MouseEvent<HTMLElement>) => {
    if (inputRef.current && !inputRef.current.contains(event.target as any)) {
      setVisit(false);
    }
  };

  const handleClickInside = () => {
    setVisit(true);
    valueRef.current?.focus();
  };

  useEffect(() => {
    document.addEventListener('mousedown', (event) => handleClickOutside(event as any));
  }, [inputRef]);
  return (
    <InputContainer ref={inputRef} visited={isVisit} onMouseUp={() => handleClickInside()}>
      <InputLabel>{label}</InputLabel>
      <InputArea>
        <InputValue
          visited={isVisit}
          value={value}
          type="number"
          ref={valueRef}
          onChange={(e: React.FormEvent<HTMLInputElement>) => setValue(e.currentTarget.value)}
        />
        <Box>{unit}</Box>
      </InputArea>
    </InputContainer>
  );
};

const InputContainer = styled(Box)<containerProps>(({ visited, theme }) => ({
  width: '100%',
  height: '36px',
  backgroundColor: '#222630',
  padding: '8px 16px',
  borderRadius: '2px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: visited ? '1px solid #3772FF' : '1px solid #222630',
  [theme.breakpoints.down('xs')]: {
    padding: '8px'
  }
}));

const InputLabel = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  color: '#777E90',
  fontWeight: 400
}));

const InputArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '2px',
  fontSize: '12px',
  color: 'rgba(255, 255, 255, 0.16)',
  alignItems: 'center'
}));

const InputValue = styled('input')<containerProps>(({ visited, theme }) => ({
  outline: 'none',
  height: '100%',
  width: '65px',
  background: 'none',
  textAlign: 'right',
  border: 'none',
  color: visited ? '#FFFFFF' : 'rgba(255, 255, 255, 0.16)',
  letterSpacing: '0.05em',

  [theme.breakpoints.down(390)]: {
    width: '50px'
  },
  [theme.breakpoints.down(350)]: {
    width: '40px'
  }
}));
