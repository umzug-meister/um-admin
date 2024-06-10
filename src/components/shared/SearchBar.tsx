import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box, Card, CardContent, IconButton, TextField } from '@mui/material';

import { PropsWithChildren, useCallback, useState } from 'react';

interface Props {
  onSearch: (searchValue: string) => void;
  onClear: () => void;
  placeholder: string;
}

export default function SearchBar({ onClear, onSearch, placeholder, children }: Readonly<PropsWithChildren<Props>>) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchRequest = useCallback(() => {
    onSearch(searchValue);
  }, [searchValue, onSearch]);

  const handleClearRequest = useCallback(() => {
    setSearchValue('');
    onClear();
  }, [onClear]);

  return (
    <Card elevation={0}>
      <CardContent>
        <Box display="flex">
          <TextField
            InputProps={{
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
            }}
            autoFocus
            placeholder={placeholder}
            value={searchValue}
            onChange={(ev) => {
              setSearchValue(ev.target.value);
            }}
            size="small"
            sx={{ margin: '0 10px', width: '330px' }}
            inputProps={{
              'data-hj-allow': '',
            }}
            onKeyDown={({ key }) => {
              if (key === 'Enter') {
                handleSearchRequest();
              }
            }}
          />
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
