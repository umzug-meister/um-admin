import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from 'um-types';

export type AppSearch = {
  [searchvalue: string]: Order[];
};

const initialState: AppSearch = {};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addSearchResults(state, action: PayloadAction<{ searchValue: string; results: Order[] }>) {
      const { results, searchValue } = action.payload;

      state[searchValue] = results;
    },
  },
});

const searchReducer = searchSlice.reducer;

export const { addSearchResults } = searchSlice.actions;

export { searchReducer };
