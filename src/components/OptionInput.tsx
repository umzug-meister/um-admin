import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';

import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { OptionName } from '../app-types';
import { useOption } from '../hooks/useOption';
import { AppDispatch } from '../store';
import { updateOption } from '../store/appReducer';
import { AppTextField } from './shared/AppTextField';

interface Props {
  name: OptionName;
  label: string;
  type?: 'text' | 'number';
  asPassword?: true;
  endAdornment?: React.ReactNode;
}

export function OptionInput(props: Readonly<Props>) {
  const { label, name, asPassword, endAdornment, type = 'text' } = props;

  const dispatch = useDispatch<AppDispatch>();
  const initValue = useOption(name);

  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState(initValue);

  const handleBlur = () => {
    dispatch(updateOption({ name, value }));
  };

  const asPasswordType = showPassword ? type : 'password';

  return (
    <AppTextField
      type={asPassword ? asPasswordType : type}
      value={value}
      name={name}
      label={label}
      onBlur={handleBlur}
      onChange={(ev) => setValue(ev.target.value)}
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
  );
}
