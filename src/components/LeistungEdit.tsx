import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Autocomplete, Box, Grid2, IconButton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

import { useMemo } from 'react';

import { useAppServices } from '../hooks/useAppServices';
import AddButton from './shared/AddButton';
import { AppTextField } from './shared/AppTextField';
import { DeleteButton } from './shared/DeleteButton';

import { arrayMoveImmutable } from 'array-move';
import { cloneDeep } from 'lodash';
import { AppPacking, AppService, MLeistung } from 'um-types';

interface Props {
  leistungen: MLeistung[] | undefined;
  update: (leistungen: MLeistung[]) => void;
  hideChecks?: boolean;
  suggestServices?: boolean;
}

export default function LeistungEdit({
  leistungen = [],
  update,
  hideChecks,
  suggestServices = false,
}: Readonly<Props>) {
  const services = useAppServices<AppService>('Bohrarbeiten');
  const packings = useAppServices<AppPacking>('Packmaterial');
  const options = useMemo(() => [...services, ...packings], [services, packings]);

  const onDelete = (index: number) => {
    const next = leistungen.filter((_, idx) => {
      return idx !== index;
    });
    update(next);
  };

  const handleClear = () => {
    update([]);
  };

  const onCheck = (checked: boolean, index: number) => {
    const current = cloneDeep(leistungen);
    current[index] = { ...current[index], calculate: checked };
    update(current);
  };

  const calculateSum = (prop: keyof MLeistung, lst: MLeistung) => {
    if (prop === 'colli' || prop === 'price') {
      if (lst.colli && lst.price) {
        lst.sum = Number(lst.colli || 0) * Number(lst.price || 0);
      }
    }
    return lst;
  };

  const onPropChange = (prop: keyof MLeistung, value: any, index: number) => {
    const current = cloneDeep(leistungen);

    const curLst = current[index];
    const nextLst = { ...curLst, [prop]: value };
    current[index] = calculateSum(prop, nextLst);
    update(current);
  };

  const addLst = () => {
    update([...leistungen, {} as MLeistung]);
  };

  const moveEntry = (index: number, pos: number) => {
    const next = arrayMoveImmutable(leistungen, index, index + pos);
    update(next);
  };

  const onLeistungSelect = (lst: GridRowService, index: number) => {
    const current = cloneDeep(leistungen);
    const curLst = current[index];
    const nextLst: MLeistung = {
      ...curLst,
      colli: 1,
      price: lst.price,
      desc: lst.name,
      sum: lst.price,
    };

    current[index] = nextLst;
    update(current);
  };

  return (
    <>
      {leistungen.map((lst, index) => {
        return (
          <GridRow
            key={index}
            lst={lst}
            autocompleteOptions={options}
            disableDown={index === leistungen.length - 1}
            disableUp={index === 0}
            hideChecks={hideChecks || false}
            suggestServices={suggestServices}
            onLeistungSelect={(lst) => onLeistungSelect(lst, index)}
            moveEntry={(offset) => moveEntry(index, offset)}
            onCheck={(checked) => onCheck(checked, index)}
            onDelete={() => onDelete(index)}
            onPropChange={(prop, value) => onPropChange(prop, value, index)}
          />
        );
      })}
      <Box display={'flex'}>
        <AddButton onClick={addLst} />
        <Box>
          <DeleteButton onDelete={handleClear} />
        </Box>
      </Box>
    </>
  );
}

type GridRowService = AppService | AppPacking;

interface GridRowProps {
  lst: MLeistung;
  hideChecks: boolean;
  suggestServices: boolean;
  autocompleteOptions: GridRowService[];
  disableUp: boolean;
  disableDown: boolean;
  onCheck: (checked: boolean) => void;
  onPropChange: (prop: keyof MLeistung, value: any) => void;
  moveEntry: (offest: number) => void;
  onDelete: () => void;
  onLeistungSelect: (srv: GridRowService) => void;
}

function GridRow({
  lst,
  hideChecks,
  suggestServices,
  autocompleteOptions,
  disableDown,
  disableUp,
  moveEntry,
  onDelete,
  onCheck,
  onPropChange,
  onLeistungSelect,
}: Readonly<GridRowProps>) {
  const hasError = lst.sum !== '' && Number(lst.sum) === 0;

  const sumDisabled = Boolean(lst.colli) && Boolean(lst.price);

  const onOptionChange = (ev: any) => {
    const selectedOptionLabel = ev?.target?.textContent;
    if (!selectedOptionLabel) {
      return;
    }
    const curOption = findLst(selectedOptionLabel);
    if (curOption) onLeistungSelect(curOption);
  };

  const findLst = (label: any) => {
    return autocompleteOptions.find(({ name }) => name === label);
  };

  return (
    <Grid2 container spacing={2}>
      {!hideChecks && (
        <Grid2 size={1}>
          <Checkbox checked={lst.calculate || false} onChange={(ev) => onCheck(ev.target.checked)} />
        </Grid2>
      )}
      <Grid2 size={hideChecks ? 6 : 5}>
        {suggestServices ? (
          <Autocomplete
            freeSolo
            value={lst.desc || ''}
            inputValue={lst.desc || ''}
            onChange={onOptionChange}
            onInputChange={(ev, newValue) => {
              //@ts-ignore
              const lst = findLst(newValue);
              if (lst) {
                onLeistungSelect(lst);
              } else {
                onPropChange('desc', newValue);
              }
            }}
            options={autocompleteOptions}
            getOptionLabel={(o) => {
              if (typeof o === 'string') {
                return o;
              }
              return o.name;
            }}
            renderInput={(params) => {
              return <AppTextField {...params} label="Leistung" />;
            }}
          />
        ) : (
          <AppTextField
            error={hasError}
            value={lst.desc}
            onChange={(ev) => onPropChange('desc', ev.target.value)}
            placeholder="Beschreibung"
          />
        )}
      </Grid2>
      <Grid2 size={1}>
        <AppTextField
          error={hasError}
          type="number"
          placeholder="Menge"
          value={lst.colli}
          onChange={(ev) => onPropChange('colli', ev.target.value)}
        />
      </Grid2>

      <Grid2 size={1}>
        <AppTextField
          type="number"
          error={hasError}
          placeholder="Preis"
          value={lst.price}
          onChange={(ev) => onPropChange('price', ev.target.value)}
          InputProps={{ endAdornment: '€' }}
        />
      </Grid2>

      <Grid2 size={2}>
        <AppTextField
          type="number"
          error={hasError}
          disabled={sumDisabled}
          placeholder="Gesamt"
          InputProps={{ endAdornment: '€' }}
          value={lst.sum}
          onChange={(ev) => onPropChange('sum', ev.target.value)}
        />
      </Grid2>

      <Grid2 size={2}>
        <Box display={'flex'}>
          <Box flex={1}>
            <IconButton onClick={() => moveEntry(1)} disabled={disableDown}>
              <KeyboardArrowDownOutlinedIcon />
            </IconButton>
            <IconButton onClick={() => moveEntry(-1)} disabled={disableUp}>
              <KeyboardArrowUpOutlinedIcon />
            </IconButton>
          </Box>
          <Box>
            <DeleteButton onDelete={onDelete} />
          </Box>
        </Box>
      </Grid2>
    </Grid2>
  );
}
