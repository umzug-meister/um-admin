import { Urls } from '../api/Urls';
import { appRequest } from '../api/fetch-client';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Category } from 'um-types';

interface AppCategories {
  all: Category[];
}

export const loadAllCategories = createAsyncThunk('loadAllCategories', () => {
  return appRequest('get')(Urls.categories());
});

export const updateCategorie = createAsyncThunk('updateCategorie', (category: Category) => {
  return appRequest('put')(Urls.categories(category.id), category);
});

export const createCategory = createAsyncThunk('createCategory', () => {
  return appRequest('post')(Urls.categories(''), {
    name: 'Neu',
  });
});

export const deleteCategorie = createAsyncThunk('deleteCategorie', (id: number) => {
  return appRequest('delete')(Urls.categories(id)).then(() => ({ id }));
});

const categoriesSlice = createSlice<AppCategories, any, 'categories', any>({
  name: 'categories',
  initialState: { all: [] },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadAllCategories.fulfilled, (state, action) => {
        state.all = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.all.push(action.payload);
      })
      .addCase(updateCategorie.fulfilled, (state, action: PayloadAction<Category>) => {
        const idx = state.all.findIndex((cat) => cat.id === action.payload.id);
        if (idx !== -1) {
          state.all.splice(idx, 1, action.payload);
        }
      })
      .addCase(deleteCategorie.fulfilled, (state, { payload }) => {
        state.all = state.all.filter((s) => s.id !== payload.id);
      });
  },
});

const categoriesReducer = categoriesSlice.reducer;
export { categoriesReducer };
