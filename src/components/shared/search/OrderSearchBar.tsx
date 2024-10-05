import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { IconButton, TextField } from '@mui/material';

import { useCallback, useState } from 'react';

interface Props {
  onSearch: (searchValue: string) => void;
  onClear?: () => void;
}

export default function OrderSearchBar({ onClear, onSearch }: Readonly<Props>) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchRequest = useCallback(() => {
    onSearch(searchValue);
  }, [searchValue, onSearch]);

  const handleClearRequest = useCallback(() => {
    setSearchValue('');
    onClear?.();
  }, [onClear]);

  return (
    <TextField
      variant="standard"
      slotProps={{
        input: {
          startAdornment: (
            <IconButton color="error" onClick={handleClearRequest}>
              <CloseOutlinedIcon />
            </IconButton>
          ),
          endAdornment: (
            <IconButton color="primary" disabled={!searchValue} onClick={handleSearchRequest}>
              <SearchOutlinedIcon />
            </IconButton>
          ),
        },
      }}
      autoFocus
      placeholder={'Suchen...'}
      value={searchValue}
      onChange={(ev) => {
        setSearchValue(ev.target.value);
      }}
      sx={{ width: '330px' }}
      inputProps={{
        'data-hj-allow': '',
      }}
      onKeyDown={({ key }) => {
        if (key === 'Enter') {
          handleSearchRequest();
        }
      }}
    />
  );
}
