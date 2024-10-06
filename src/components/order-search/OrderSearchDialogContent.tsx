import { Box, Chip, DialogContent, DialogTitle, Typography } from '@mui/material';
import OrderSearchBar from '../shared/search/OrderSearchBar';
import { useCallback, useState } from 'react';
import { useOrderSearch } from '../shared/search/orderSearchQuery';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import { addSearchResults, AppSearch } from '../../store/searchReducer';
import { Order } from 'um-types';
import { SearchResult } from './SearchResult';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

export function OrderSearchDialogContent() {
  const [results, setResults] = useState<Order[]>([]);

  const onFinally = () => {};

  const onSearchFn = useOrderSearch(onFinally);
  const dispatch = useDispatch<AppDispatch>();

  const onSearch = (searchValue: string) => {
    if (searchValue) {
      onSearchFn(searchValue).then((results) => {
        setResults(results);
        dispatch(addSearchResults({ results, searchValue }));
      });
    }
  };

  const appSearch = useSelector<AppState, AppSearch>((s) => s.search);

  const lastSearchValues = Object.keys(appSearch);

  const onClear = useCallback(() => {
    setResults([]);
  }, []);

  const getResultsFromStore = (searchValue: string) => {
    const searchResults = appSearch[searchValue];
    if (searchResults) {
      setResults(searchResults);
    }
  };

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
                  variant="outlined"
                  size="small"
                  label={searchValue}
                  key={searchValue}
                  deleteIcon={<HistoryOutlinedIcon />}
                  onClick={() => getResultsFromStore(searchValue)}
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
