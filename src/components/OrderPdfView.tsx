import { Box, Button, ButtonGroup, Card } from '@mui/material';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

interface Props {
  base64: string | null;
}

export default function OrderPdfView({ base64 }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  if (base64 === null) {
    return null;
  }

  const changePage = (offset: number) => {
    setPageNumber((pn) => pn + offset);
  };

  return (
    <Box display="flex" flexDirection="column" position="relative">
      <Box m="auto">
        <Card>
          <Document
            file={base64}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
            }}
          >
            <Page pageNumber={pageNumber} renderTextLayer={false} />
          </Document>
        </Card>
      </Box>
      <Box position="absolute" bottom={10} left={'50%'} sx={{ transform: 'translateX(-50%)' }}>
        <ButtonGroup variant="outlined">
          <Button onClick={() => changePage(-1)} disabled={pageNumber === 1}>
            <NavigateBeforeIcon />
          </Button>
          <Button onClick={() => changePage(1)} disabled={pageNumber === numPages}>
            <NavigateNextIcon />
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}
