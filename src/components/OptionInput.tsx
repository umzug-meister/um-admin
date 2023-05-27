import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { OptionKey, useOption } from '../hooks/useOption';
import { AppDispatch } from '../store';
import { updateOption } from '../store/appReducer';
import { AppTextField } from './shared/AppTextField';

interface Props {
  name: string;
  label: string;
  type?: 'text' | 'number';
  asPassword?: true;
  endAdornment?: React.ReactNode;
}

export function OptionInput(props: Props) {
  const { label, name, asPassword, endAdornment, type = 'text' } = props;

  const [value, setValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const initValue = useOption(name);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  const handleChange = (value: any) => {
    setValue(value);
  };

  const handleBlur = () => {
    dispatch(updateOption({ name, value }));
  };

  return (
    <>
      <AppTextField
        type={asPassword ? (showPassword ? type : 'password') : type}
        value={value}
        name={name}
        label={label}
        onBlur={handleBlur}
        onChange={(ev) => handleChange(ev.target.value)}
        InputProps={
          asPassword
            ? {
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowPassword((sp) => !sp);
                    }}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }
            : { endAdornment }
        }
      />
    </>
  );
}
