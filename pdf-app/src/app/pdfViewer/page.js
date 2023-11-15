"use client"

// pdfViewer.js (or PdfViewerPage.js)

import { Document, Page, pdfjs } from 'react-pdf';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer() {
  const router = useRouter();
  const [pdfData, setPdfData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    // Retrieve PDF data from router query
    const { pdfData } = router.query;
    setPdfData(pdfData);
  }, [router.query]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePrevious = () => {
    setPageNumber(prevPageNumber => prevPageNumber - 1);
  };

  const handleNext = () => {
    setPageNumber(prevPageNumber => prevPageNumber + 1);
  };

  return (
    <div>
      <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <button onClick={handlePrevious} disabled={pageNumber <= 1}>
        Previous
      </button>
      <button onClick={handleNext} disabled={pageNumber >= numPages}>
        Next
      </button>
    </div>
  );
}

