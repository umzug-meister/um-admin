import { Grid2 } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import AddButton from '../components/shared/AddButton';
import { AppCard } from '../components/shared/AppCard';
import { AppDataGrid } from '../components/shared/AppDataGrid';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { useCategories } from '../hooks/useCategories';
import { AppDispatch } from '../store';
import { createCategory, deleteCategorie, updateCategorie } from '../store/categoriesReducer';

import { Category } from '@umzug-meister/um-core';

function generateSlug(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (v) => chars[v % chars.length]).join('');
}

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function Categories() {
  const categories = useCategories();
  const dispatch = useDispatch<AppDispatch>();

  const onUpdate = useCallback(
    (cat: Category) => {
      const updated = { ...cat, slug: nameToSlug(cat.name) };
      return dispatch(updateCategorie(updated));
    },
    [dispatch],
  );

  const onDelete = useCallback(
    (id: number) => {
      dispatch(deleteCategorie(id));
    },
    [dispatch],
  );

  const onAdd = useCallback(() => {
    dispatch(createCategory(generateSlug()));
  }, [dispatch]);

  return (
    <AppGridContainer>
      <Grid2 size={12}>
        <AppCard title="Möbel Kategorien">
          <AddButton onClick={onAdd} />
          <AppDataGrid
            columns={[
              {
                field: 'id',
                headerName: 'ID',
              },
              {
                field: 'sort',
                headerName: 'Sortierung',
                type: 'number',
                editable: true,
              },
              {
                field: 'name',
                headerName: 'Name',
                flex: 1,
                editable: true,
              },
            ]}
            data={categories}
            paginationMode="client"
            disablePagination
            allowDeletion
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </AppCard>
      </Grid2>
    </AppGridContainer>
  );
}
