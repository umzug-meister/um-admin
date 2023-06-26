import { useSelector } from 'react-redux';

import { AppOptions, OptionName } from '../app-types';
import { AppState } from '../store';

export function useOption(name: OptionName) {
  const options = useSelector<AppState, AppOptions>((s) => s.app.options);
  const value = options[name];
  return value;
}
