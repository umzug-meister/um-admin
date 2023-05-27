import { Typography } from '@mui/material';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useOption } from '../hooks/useOption';
import { AppDispatch } from '../store';
import { updateOption } from '../store/appReducer';

import { compareVersions } from 'compare-versions';

export function Version() {
  const dispatch = useDispatch<AppDispatch>();
  const remote = useOption('appversion');
  const local = process.env.REACT_APP_VERSION || '0.0.0';

  useEffect(() => {
    if (!validVersion(remote)) {
      dispatch(updateOption({ name: 'appversion', value: local }));
    }
  }, [remote, dispatch, local]);

  useEffect(() => {
    if (validVersion(remote)) {
      const compared = compareVersions(local, remote);

      if (compared === 1) {
        dispatch(updateOption({ name: 'appversion', value: local }));
      }
      if (compared === -1) {
        alert(Message(local, remote));
      }
    }
  }, [remote, local, dispatch]);

  return <Typography>Version: {local}</Typography>;
}

const Message = (
  local: string,
  remote: string,
) => `❗️Deine Version (${local}) von Umzug Meister ist nicht mehr aktuell❗️
Die aktuelle Version ist ${remote}.
Um auf die neueste Version zu aktualisieren, drücke bitte folgende Tastenkombination:

MAC: Cmd + Shift + R
Windows: Ctrl(Strg) + Shift + R
`;

function validVersion(v: string | undefined) {
  if (typeof v == 'undefined') {
    return false;
  }

  const regex = /[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,3}/gm;

  return regex.test(v);
}
