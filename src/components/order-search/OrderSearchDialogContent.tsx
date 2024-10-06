import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { Box, Chip, DialogContent, DialogTitle, Typography } from '@mui/material';

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, AppState } from '../../store';
import { AppSearch, addSearchResults } from '../../store/searchReducer';
import OrderSearchBar from '../shared/search/OrderSearchBar';
import { useOrderSearch } from '../shared/search/orderSearchQuery';
import { SearchResult } from './SearchResult';

import { Order } from 'um-types';

export function OrderSearchDialogContent() {
  const [results, setResults] = useState<Order[]>([]);

  const onSearchFn = useOrderSearch();
  const dispatch = useDispatch<AppDispatch>();

  const onSearch = (searchValue: string) => {
    if (searchValue) {
      onSearchFn(searchValue).then((results) => {
        setResults(results);
        dispatch(addSearchResults({ searchValue }));
      });
    }
  };

  const appSearch = useSelector<AppState, AppSearch>((s) => s.search);

  const lastSearchValues = Object.keys(appSearch);

  const onClear = useCallback(() => {
    setResults([]);
  }, []);

  return (
    <>
      <DialogTitle>
        <OrderSearchBar onSearch={onSearch} onClear={onClear} />
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection={'column'} gap={2}>
          {results.length === 0 && (
            <Box display="flex" gap={2}>
              {lastSearchValues.map((searchValue) => (
                <Chip
                  color="primary"
                  variant="outlined"
                  size="small"
                  label={searchValue}
                  key={searchValue}
                  icon={<HistoryOutlinedIcon />}
                  onClick={() => onSearch(searchValue)}
                />
              ))}
            </Box>
          )}
          <Box>
            {results.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Keine Ergebnisse
              </Typography>
            )}
            <Box display="flex" flexDirection={'column'} gap={1}>
              {results.map((order) => (
                <SearchResult key={order.id} order={order} />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </>
  );
}
