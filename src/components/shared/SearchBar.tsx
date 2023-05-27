import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Card, IconButton, TextField } from '@mui/material';

import { useCallback, useState } from 'react';

interface Props {
  onSearch: (searchValue: string) => void;
  onClear: () => void;
  placeholder: string;
}

export default function SearchBar({ onClear, onSearch, placeholder }: Props) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchRequest = useCallback(() => {
    onSearch(searchValue);
  }, [searchValue]);

  const handleClearRequest = useCallback(() => {
    setSearchValue('');
    onClear();
  }, [onClear]);

  return (
    <Card elevation={0} sx={{ padding: 2, mb: 2 }}>
      <IconButton color="error" onClick={handleClearRequest}>
        <CloseOutlinedIcon />
      </IconButton>
      <TextField
        placeholder={placeholder}
        value={searchValue}
        onChange={(ev) => {
          setSearchValue(ev.target.value);
        }}
        size="small"
        sx={{ margin: '0 10px', width: '300px' }}
      />
      <IconButton disabled={!searchValue} onClick={handleSearchRequest}>
        <SearchOutlinedIcon />
      </IconButton>
    </Card>
  );
}
