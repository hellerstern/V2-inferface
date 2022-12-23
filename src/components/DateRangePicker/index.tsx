import React from 'react';
import { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import { styled } from '@mui/system';

interface RangePickerProps {
  value: DateRange<Dayjs>;
  setValue: (value: DateRange<Dayjs>) => void;
}

export const TigrisDateRangePicker = (props: RangePickerProps) => {
  const { value, setValue } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangePicker
        value={value}
        onChange={(newValue: any) => setValue(newValue)}
        renderInput={(startProps: any, endProps: any) => (
          <React.Fragment>
            <Input ref={startProps.inputRef as React.Ref<HTMLInputElement>} {...startProps.inputProps} />
            <Box sx={{ mx: 1 }}> - </Box>
            <Input ref={endProps.inputRef as React.Ref<HTMLInputElement>} {...endProps.inputProps} />
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
  );
};

const Input = styled('input')(({ theme }) => ({
  outline: 'none',
  backgroundColor: '#222630',
  border: 'none',
  color: '#FFF',
  borderRadius: '2px',
  padding: '4px 5px'
}));
