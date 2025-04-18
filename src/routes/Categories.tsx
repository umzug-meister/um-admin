import { Grid } from '@mui/material';

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

export default function Categories() {
  const categories = useCategories();
  const dispatch = useDispatch<AppDispatch>();

  const onUpdate = useCallback(
    (cat: Category) => {
      dispatch(updateCategorie(cat));
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
    dispatch(createCategory());
  }, [dispatch]);

  return (
    <AppGridContainer>
      <Grid size={12}>
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
      </Grid>
    </AppGridContainer>
  );
}
