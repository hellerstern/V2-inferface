import { Box } from '@mui/material';
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
        <InputUnit>{unit}</InputUnit>
      </InputArea>
    </InputContainer>
  );
};

const InputContainer = styled(Box)<containerProps>(({ visited }) => ({
  width: '100%',
  height: '36px',
  backgroundColor: '#222630',
  padding: '8px 16px',
  borderRadius: '2px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: visited ? '1px solid #3772FF' : '1px solid #222630'
}));

const InputLabel = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  color: '#777E90',
  fontWeight: 400,
  [theme.breakpoints.down('xs')]: {
    fontSize: '10px'
  },
  [theme.breakpoints.down(390)]: {
    fontSize: '8px'
  }
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
  width: '70px',
  background: 'none',
  textAlign: 'right',
  border: 'none',
  color: visited ? '#FFFFFF' : 'rgba(255, 255, 255, 0.16)',
  letterSpacing: '0.05em',
  [theme.breakpoints.down('xs')]: {
    fontSize: '10px'
  },
  [theme.breakpoints.down(390)]: {
    fontSize: '8px',
    width: '40px'
  }
}));

const InputUnit = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    fontSize: '10px'
  },
  [theme.breakpoints.down(390)]: {
    fontSize: '8px'
  }
}));
