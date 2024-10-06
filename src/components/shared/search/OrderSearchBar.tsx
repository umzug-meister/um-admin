import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import { IconButton, TextField } from '@mui/material';

import { useCallback, useRef } from 'react';

import { KeyboardIcon } from '../../KeyboardIcon';

interface Props {
  onSearch: (searchValue: string) => void;
  onClear?: () => void;
}

export default function OrderSearchBar({ onClear, onSearch }: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchRequest = useCallback(() => {
    const searchValue = inputRef.current?.value?.trim() || '';
    onSearch(searchValue);
  }, [onSearch]);

  const handleClearRequest = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onClear?.();
  }, [onClear]);

  return (
    <TextField
      inputRef={inputRef}
      fullWidth
      variant="standard"
      slotProps={{
        htmlInput: {
          'data-hj-allow': '',
        },
        input: {
          startAdornment: (
            <IconButton onClick={handleClearRequest}>
              <CloseOutlinedIcon />
            </IconButton>
          ),
          endAdornment: (
            <IconButton sx={{ width: '40px' }} onClick={handleSearchRequest}>
              <KeyboardIcon label={<KeyboardReturnOutlinedIcon fontSize="small" />}></KeyboardIcon>
            </IconButton>
          ),
        },
      }}
      autoFocus
      placeholder={'Auftrag suchen...'}
      onKeyDown={({ key }) => {
        if (key === 'Enter') {
          handleSearchRequest();
        }
      }}
    />
  );
}
