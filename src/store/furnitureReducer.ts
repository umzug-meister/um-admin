import { Urls } from '../api/Urls';
import { appRequest } from '../api/fetch-client';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Furniture } from 'um-types';

export interface AppFurniture {
  all: Furniture[];
}

export const loadAllFurniture = createAsyncThunk('loadAllFurniture', () => {
  return appRequest('get')(Urls.items());
});

export const updateFurniture = createAsyncThunk('updatFurniture', (furniture: Furniture) =>
  appRequest('put')(Urls.items(furniture.id), furniture),
);

export const createFurniture = createAsyncThunk('createFurniture', () =>
  appRequest('post')(Urls.items(''), { name: 'Neu' }),
);

export const deleteFurniture = createAsyncThunk('deleteFurniture', (id: number) => {
  return appRequest('delete')(Urls.items(id)).then(() => ({ id }));
});

const furnitureSlice = createSlice<AppFurniture, any, 'furniture', any>({
  initialState: { all: [] },
  name: 'furniture',
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadAllFurniture.fulfilled, (state, action) => {
        state.all = action.payload;
      })
      .addCase(createFurniture.fulfilled, (state, action) => {
        state.all.push(action.payload);
      })
      .addCase(updateFurniture.fulfilled, (state, action: PayloadAction<Furniture>) => {
        const idx = state.all.findIndex((f) => f.id === action.payload.id);
        if (idx !== -1) {
          state.all.splice(idx, 1, action.payload);
        }
      })
      .addCase(deleteFurniture.fulfilled, (state, { payload }) => {
        state.all = state.all.filter((s) => s.id !== payload.id);
      });
  },
});

const furnitureReducer = furnitureSlice.reducer;
export { furnitureReducer };
