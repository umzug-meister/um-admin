import { Checkbox, FormControlLabel, FormGroup, MenuItem } from '@mui/material';

import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useOption } from '../hooks/useOption';
import { AppDispatch, AppState } from '../store';
import { updateOrderProps } from '../store/appReducer';
import { AppDateField } from './shared/AppDateField';
import { AppTextField } from './shared/AppTextField';

import { Loader } from '@googlemaps/js-api-loader';
import { Order } from 'um-types';

type Path = keyof Order;
type NestedPath<T> = keyof T;

interface Props<T> {
  path: Path;
  nestedPath?: NestedPath<T>;
  label?: string;
  type?: 'text' | 'number' | 'time';
  multiline?: true;
  select?: true;
  enableMaps?: true;
  selectOptions?: string[];
  as?: 'default' | 'checkbox' | 'date';
  capitalize?: true;
  id?: string;
}

const options = {
  fields: ['formatted_address', 'address_components'],
  componentRestrictions: { country: ['de', 'at', 'ch'] },
};

export default function OrderField<T>({
  label,
  path,
  nestedPath,
  type = 'text',
  select,
  selectOptions,
  multiline,
  as,
  enableMaps,
  id,
  capitalize,
}: Props<T>) {
  const value = useOrderValue(path, nestedPath);
  const dispatch = useDispatch<AppDispatch>();
  const gapiKey = useOption('gapikey');

  const loaderRef = useRef<Loader | null>(null);

  const handleChange = useCallback(
    (value: any) => {
      const propPath: string[] = [path];
      if (nestedPath) {
        propPath.push(String(nestedPath));
      }
      dispatch(updateOrderProps({ path: propPath, value }));
    },
    [path, nestedPath, dispatch],
  );

  useEffect(() => {
    if (enableMaps && gapiKey) {
      if (loaderRef.current == null) {
        loaderRef.current = new Loader({
          apiKey: gapiKey,
          libraries: ['places'],
        });
      }

      loaderRef.current.load().then((google) => {
        const autocomplete = new google.maps.places.Autocomplete(document.getElementById(id!) as any, options);

        autocomplete.addListener('place_changed', () => {
          const { formatted_address } = autocomplete.getPlace();
          if (formatted_address) {
            handleChange(formatted_address.replace(', Deutschland', '').replace(', Германия', ''));
          }
        });
      });
    }
  }, [enableMaps, gapiKey, handleChange, id]);

  if (as === 'date') {
    return <AppDateField label={label} value={String(value)} onDateChange={handleChange} />;
  }

  if (as === 'checkbox') {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(value)}
              onChange={(ev) => {
                handleChange(ev.target.checked);
              }}
            />
          }
          label={label}
        />
      </FormGroup>
    );
  }

  let onBlur = undefined;
  if (capitalize) {
    onBlur = () => {
      if (value) {
        const capitalizedValue = (value as string).capitalize();
        handleChange(capitalizedValue);
      }
    };
  }

  return (
    <AppTextField
      id={id}
      select={select}
      multiline={multiline}
      onChange={(ev) => handleChange(ev.target.value)}
      type={type}
      label={label}
      value={value}
      onBlur={onBlur}
    >
      {selectOptions?.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </AppTextField>
  );
}

function useOrderValue<T>(path: Path, nestedPath?: NestedPath<T>) {
  const order = useSelector<AppState, Order>((s) => s.app.current!);

  let value = order[path];
  if (nestedPath && typeof value === 'object') {
    //@ts-ignore
    value = value[nestedPath];
  }
  return value || '';
}
