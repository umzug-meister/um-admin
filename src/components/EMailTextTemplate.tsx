import { Box } from '@mui/material';

interface Props {
  orderId: string | number;
  anrede: string;
  hasMontage: boolean | undefined;
  persons: string;
  stunden: string;
  extra: string;
  servicesHTML: string;
  volume: string | number | undefined;
  date: string | undefined;
  time: string | undefined;
  elementID: string;
}

export default function EMailTextTemplate({
  orderId,
  anrede,
  hasMontage,
  persons,
  stunden,
  extra,
  servicesHTML,
  volume,
  date,
  time,
  elementID,
}: Props) {
  return (
    <Box
      id={elementID}
      p={1}
      sx={{
        fontSize: '14px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: 'black',
      }}
    >
      <p style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Kostenvoranschlag</p>
      <p>
        Bei Rückfragen, bitte folgende ID bereithalten:
        <i style={{ fontStyle: 'normal', fontWeight: 'bold' }}>{` ${orderId}`}</i>
      </p>
      <p>{anrede}</p>
      <p>
        gerne übernehmen wir Ihren Umzug am{' '}
        <strong>
          {date} um {time} Uhr.
        </strong>
      </p>
      {volume && <p style={{ fontWeight: 'bold' }}>Umzugsgut: {volume} m³</p>}
      <br />
      <p style={{ textDecoration: 'bold' }}>Unser Kostenvoranschlag beinhaltet:</p>
      <ul>
        <li>Anfahrt / Lastfahrtkosten</li>
        {hasMontage ? <li>Möbeldemontage/Montage</li> : null}
        <li>Bereitstellung eines Umzugswagens</li>
        <li>Versicherung: bis 2 Mio. Euro</li>
        <li>Be- und Entladen des LKWs</li>
        <li>Spanngurte, Dieselkosten sowie ausreichend Schutzdecken</li>
        <li>Ordentliche Rechnungsstellung</li>
      </ul>
      <p>
        <b>{persons}</b>
      </p>
      <p>{stunden}</p>
      <p>{extra}</p>
      <br />
      <table style={{ maxWidth: '600px', borderBottom: '1px solid black' }}>
        <tbody dangerouslySetInnerHTML={{ __html: servicesHTML }}></tbody>
      </table>
      <br />
      <p>{`Unser Kostenvoranschlag gilt bis zum ${new Date().addDays(3).toLocaleDateString('ru')}.`}</p>
      <p style={{ color: 'blue', fontWeight: 'bold' }}>Im Anhang erhalten Sie den Auftrag.</p>
      <p style={{ color: 'blue', fontWeight: 'bold' }}>
        Ich bitte um Ihre Rückmeldung (Rückbestätigung per E-Mail ohne Unterschrift).
      </p>
      <p style={{ color: 'red' }}>
        {` Nutzen Sie unseren `}
        <a href="https://umzugruckzuck.de/umzug-muenchen-kartonrechner/">Kartonrechner</a>, um die Anzahl der Kartons
        abzuschätzen!
      </p>
      <p style={{ fontWeight: 'bold' }}>
        --
        <br />
        Sollten Sie Interesse nach Renovierungs- und Ausbesserungsarbeiten haben, kontaktieren Sie bitte unseren
        Partner: 0176 305 451 65.
      </p>
    </Box>
  );
}
