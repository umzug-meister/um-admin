import { Urls } from '../api/Urls';
import { appRequest } from '../api/fetch-client';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Category } from '@umzug-meister/um-core';

interface AppCategories {
  all: Category[];
}

const RANDOM_NAME_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const RANDOM_NAME_LENGTH = 8;

const getSecureRandomIndex = (maxExclusive: number): number => {
  const maxByteValue = 256;
  const acceptableUpperBound = Math.floor(maxByteValue / maxExclusive) * maxExclusive;
  const randomByte = new Uint8Array(1);

  do {
    crypto.getRandomValues(randomByte);
  } while (randomByte[0] >= acceptableUpperBound);

  return randomByte[0] % maxExclusive;
};

export const loadAllCategories = createAsyncThunk('loadAllCategories', () => {
  return appRequest('GET')(Urls.categories());
});

export const updateCategorie = createAsyncThunk('updateCategorie', (category: Category) => {
  return appRequest('PUT')(Urls.categories(category.id), category);
});

export const createCategory = createAsyncThunk('createCategory', async (slug: string) => {
  const randomName = Array.from(
    { length: RANDOM_NAME_LENGTH },
    () => RANDOM_NAME_ALPHABET.charAt(getSecureRandomIndex(RANDOM_NAME_ALPHABET.length)),
  ).join('');
  const result = await appRequest('POST')(Urls.categories(''), {
    name: randomName,
    slug,
  });
  return { ...result, slug, name: randomName };
});

export const deleteCategorie = createAsyncThunk('deleteCategorie', (id: number) => {
  return appRequest('DELETE')(Urls.categories(id)).then(() => ({ id }));
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
