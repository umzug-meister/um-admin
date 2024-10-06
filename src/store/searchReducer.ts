import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type AppSearch = {
  all: string[];
};

const initialState: AppSearch = { all: [] };

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addSearchResults(state, action: PayloadAction<{ searchValue: string }>) {
      const { searchValue } = action.payload;
      if (!state.all.includes(searchValue)) {
        state.all.push(searchValue);
      }
    },
  },
});

const searchReducer = searchSlice.reducer;

export const { addSearchResults } = searchSlice.actions;

export { searchReducer };
