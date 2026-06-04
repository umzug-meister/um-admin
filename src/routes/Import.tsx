import { Box, Button, Card, Chip, CircularProgress, Grid2, LinearProgress, Stack, TextField, Typography } from '@mui/material';

import { useCallback, useState } from 'react';

import { Urls } from '../api/Urls';
import { appRequest } from '../api/fetch-client';
import { AppGridContainer } from '../components/shared/AppGridContainer';

function stripIds(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map(stripIds);
  }
  if (data && typeof data === 'object') {
    const obj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
      if (key === 'id') continue;
      obj[key] = stripIds(val);
    }
    return obj;
  }
  return data;
}

const REMOVE_ITEM_KEYS = new Set(['demontage', 'montage', 'montagePrice', 'montageprice', 'm100', 'm150', 'colli', 'extraPrice']);

function cleanItems(data: unknown): unknown {
  const strip = (items: any[]) =>
    items.map((item: any) => {
      if (item && typeof item === 'object') {
        const obj: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(item)) {
          if (REMOVE_ITEM_KEYS.has(key)) continue;
          obj[key] = val;
        }
        return obj;
      }
      return item;
    });

  if (Array.isArray(data)) {
    return strip(data);
  }
  if (data && typeof data === 'object' && 'all' in data && Array.isArray((data as any).all)) {
    return { ...data, all: strip((data as any).all) };
  }
  return data;
}

function cleanServices(data: unknown): unknown {
  const strip = (items: any[]) =>
    items
      .filter((item: any) => item?.tag !== 'Counter')
      .map((item: any) => {
        if (item && typeof item === 'object') {
          const { name, t75, ...rest } = item;
          if (item?.tag === 'Price') return rest;
          return { ...rest };
        }
        return item;
      });

  if (Array.isArray(data)) {
    return strip(data);
  }
  if (data && typeof data === 'object' && 'all' in data && Array.isArray((data as any).all)) {
    return { ...data, all: strip((data as any).all) };
  }
  return data;
}

const SECTIONS = [
  { key: 'services', label: 'Leistungen', url: (base: string) => `${base}/service/all` },
  { key: 'categories', label: 'Kategorien', url: (base: string) => `${base}/item-category/all` },
  { key: 'items', label: 'Artikel', url: (base: string) => `${base}/item/all` },
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];

type SectionState = {
  loading: boolean;
  data: unknown | null;
  error: string | null;
  importing: boolean;
  importProgress: { current: number; total: number; label: string } | null;
  importError: string | null;
};

type ImportState = Record<SectionKey, SectionState>;

const initial = (): ImportState =>
  Object.fromEntries(
    SECTIONS.map((s) => [s.key, { loading: false, data: null, error: null, importing: false, importProgress: null, importError: null }]),
  ) as ImportState;

const POST_URL: Record<SectionKey, string> = {
  services: Urls.services(''),
  categories: Urls.categories(''),
  items: Urls.items(''),
};

function getArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'all' in data && Array.isArray((data as any).all)) return (data as any).all;
  return [];
}

export default function Import() {
  const [baseUrl, setBaseUrl] = useState('');
  const [state, setState] = useState<ImportState>(initial);

  const update = useCallback((key: SectionKey, patch: Partial<SectionState>) => {
    setState((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }, []);

  const fetchSection = useCallback(
    async (section: (typeof SECTIONS)[number]) => {
      if (!baseUrl) return;

      update(section.key, { loading: true, data: null, error: null });

      try {
        const url = section.url(baseUrl.replace(/\/+$/, ''));
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const raw: unknown = await response.json();
        const cleaned = section.key === 'services' ? cleanServices(raw) : section.key === 'items' ? cleanItems(raw) : raw;
        const data = stripIds(cleaned);

        update(section.key, { loading: false, data, error: null });
      } catch (e: any) {
        update(section.key, { loading: false, data: null, error: e.message ?? 'Unbekannter Fehler' });
      }
    },
    [baseUrl, update],
  );

  const fetchAll = useCallback(async () => {
    for (const section of SECTIONS) {
      await fetchSection(section);
    }
  }, [fetchSection]);

  const importSection = useCallback(
    async (key: SectionKey) => {
      const data = state[key].data;
      if (!data) return;

      update(key, { importing: true, importProgress: null, importError: null });

      const items = getArray(data);
      const post = appRequest('POST');
      const url = POST_URL[key];

      const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

      try {
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as any;
          const label = item?.name ?? item?.label ?? `Eintrag ${i + 1}`;
          update(key, { importProgress: { current: i + 1, total: items.length, label } });

          const result = await post(url, item);
          if (result === null) {
            throw new Error(`Fehler bei "${label}"`);
          }

          if (i < items.length - 1) await delay(500);
        }

        update(key, { importing: false, importProgress: { current: items.length, total: items.length, label: 'Abgeschlossen' } });
      } catch (e: any) {
        update(key, { importing: false, importError: e.message ?? 'Import fehlgeschlagen' });
      }
    },
    [state, update],
  );

  const hasData = Object.values(state).some((s) => s.data !== null);

  return (
    <Box p={2}>
      <Card elevation={0}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Daten importieren
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <TextField
              size="small"
              label="API Basis URL"
              placeholder="https://alte-domain.de/wp-json/um-configurator/v1"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              sx={{ minWidth: 420 }}
            />
            <Button variant="contained" disabled={!baseUrl} onClick={fetchAll}>
              Alle laden
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {SECTIONS.map((section) => {
              const s = state[section.key];
              return (
                <Button
                  key={section.key}
                  size="small"
                  variant="outlined"
                  disabled={!baseUrl || s.loading}
                  onClick={() => fetchSection(section)}
                >
                  {section.label}
                  {s.loading && ' …'}
                  {s.data ? <Chip size="small" label="✓" color="success" sx={{ ml: 0.5 }} /> : null}
                  {s.error ? <Chip size="small" label="✗" color="error" sx={{ ml: 0.5 }} /> : null}
                </Button>
              );
            })}
          </Stack>

          {hasData && (
            <AppGridContainer>
              {SECTIONS.map((section) => {
                const s = state[section.key];
                if (!s.data) return null;

                const items = getArray(s.data);

                return (
                  <Grid2 key={section.key} size={{ xs: 12, md: 4 }} mt={2} display="flex" flexDirection="column">
                    <Typography variant="subtitle2" gutterBottom>
                      {section.label} ({items.length})
                    </Typography>

                    {!s.importing && !s.importError && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => importSection(section.key)}
                        sx={{ mb: 1, alignSelf: 'flex-start' }}
                      >
                        Importieren
                      </Button>
                    )}

                    {s.importing && (
                      <Box mb={1}>
                        <LinearProgress
                          variant="determinate"
                          value={(s.importProgress?.current ?? 0) / (s.importProgress?.total ?? 1) * 100}
                        />
                        <Typography variant="caption">
                          {s.importProgress?.current ?? 0} / {s.importProgress?.total ?? 0} —{' '}
                          {s.importProgress?.label ?? ''}
                        </Typography>
                      </Box>
                    )}

                    {s.importError && (
                      <Box mb={1}>
                        <Chip size="small" label={s.importError} color="error" sx={{ mb: 0.5 }} />
                        <br />
                        <Button size="small" variant="outlined" onClick={() => importSection(section.key)}>
                          Wiederholen
                        </Button>
                      </Box>
                    )}

                    <Box
                      component="pre"
                      sx={{
                        backgroundColor: 'grey.100',
                        p: 2,
                        borderRadius: 1,
                        overflow: 'auto',
                        maxHeight: 400,
                        fontSize: '0.75rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        flex: 1,
                      }}
                    >
                      {JSON.stringify(s.data, null, 2)}
                    </Box>
                  </Grid2>
                );
              })}
            </AppGridContainer>
          )}
        </Box>
      </Card>
    </Box>
  );
}
