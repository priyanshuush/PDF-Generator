"use client"

import { Document, Page, pdfjs } from 'react-pdf';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



// Component definition for the PDF Viewer
export default function PdfViewer() {
  const router = useRouter(); // Initializing Next.js router
  const [pdfData, setPdfData] = useState(null); // State to hold PDF data
  const [numPages, setNumPages] = useState(null); // State to hold number of pages in the PDF
  const [pageNumber, setPageNumber] = useState(1); // State to track current page number


  // useEffect hook to update PDF data when router query changes
  useEffect(() => {
    // Retrieve PDF data from router query
    const { pdfData } = router.query; // Extracting 'pdfData' from router query
    setPdfData(pdfData); // Updating the state with the retrieved PDF data
  }, [router.query]); // Dependencies: re-run effect when router query changes



  // Function triggered on successful loading of PDF
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages); // Set the total number of pages in the PDF
  };



  // Function to handle moving to the previous page
  const handlePrevious = () => {
    setPageNumber(prevPageNumber => prevPageNumber - 1); // Decrement the page number
  };



  // Function to handle moving to the next page
  const handleNext = () => {
    setPageNumber(prevPageNumber => prevPageNumber + 1); // Increment the page number
  };



  // JSX layout for the PDF Viewer component
  return (
    <div>
      {/* Display the PDF document */}
      <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} /> {/* Display the current page */}
      </Document>

      {/* Display current page number and total number of pages */}
      <p>
        Page {pageNumber} of {numPages}
      </p>

      {/* Button to navigate to the previous page */}
      <button onClick={handlePrevious} disabled={pageNumber <= 1}>
        Previous
      </button>

      {/* Button to navigate to the next page */}
      <button onClick={handleNext} disabled={pageNumber >= numPages}>
        Next
      </button>
    </div>
  );
}