"use client";

import jsPDF from 'jspdf';
import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function Dropzone() {

  const canvasRefs = useRef([]);

  const [pdfData, setPdfData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedPages, setSelectedPages] = useState([]);

  const onFileLoad = useCallback(({ target: { result } }) => {
    setPdfData(result);
    setPageNumber(1); // Reset to the first page when a new PDF is loaded
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setSelectedPages(Array.from({ length: numPages }, (_, i) => false));
  }, []);


  const toggleCheckbox = (index) => {
    setSelectedPages((prevSelectedPages) =>
      prevSelectedPages.map((selected, i) => (i === index ? !selected : selected))
    );
  };

  const handlePrevious = () => {
    if (pageNumber > 1) {
      setPageNumber(prevPageNumber => prevPageNumber - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < numPages) {
      setPageNumber(prevPageNumber => prevPageNumber + 1);
    }
  };

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0].type !== 'application/pdf') {
      alert('Invalid file. Only PDF files are allowed.');
    } else {
      const reader = new FileReader();
      reader.onload = onFileLoad;
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, [onFileLoad]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf',
  });


  const getPageText = async (page) => {
    return new Promise((resolve, reject) => {
      try {
        page.getTextContent().then((textContent) => {
          const pageText = textContent.items.map((s) => s.str).join('');
          resolve(pageText);
        });
      } catch (error) {
        reject(error);
      }
    });
  };


  const generatePDF = async () => {
    const newPdf = new jsPDF();
    const selectedPagesIndexes = selectedPages.reduce((acc, isSelected, index) => {
      if (isSelected) acc.push(index + 1); // Push the selected page number (1-indexed)
      return acc;
    }, []);

    try {
      const loadingTask = pdfjs.getDocument(pdfData);
      const pdf = await loadingTask.promise;

      for (let i = 0; i < selectedPagesIndexes.length; i++) {
        const pageNumber = selectedPagesIndexes[i];
        const page = await pdf.getPage(pageNumber);

        const scale = 2; // Adjust the scale as needed
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        const imgData = canvas.toDataURL('image/jpeg');
        newPdf.addImage(imgData, 'JPEG', 0, 0, viewport.width / 6, viewport.height / 6); // Adjust scale

        if (i !== selectedPagesIndexes.length - 1) {
          newPdf.addPage();
        }
      }

      newPdf.save('selectedPages.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };


  return (
    <div className="flex-grow mx-auto h-screen">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center h-screen ${
          isDragActive ? 'border-blue-400' : 'border-gray-300'
        } border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-10 h-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Only PDF files are allowed</p>
        </div>
      </div>

      {pdfData && (
        <div className="mt-10 min-w-min  ml-10 mr-10">
          <div className="border-2 border-gray-300 rounded-lg shadow-md">
            <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Page
                pageNumber={pageNumber}
                width={800}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                customTextRenderer={false} />
            </div>
            </Document>
          </div>
          <div className="flex justify-between mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
              onClick={handlePrevious}
              disabled={pageNumber <= 1}
            >
              Previous
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
              onClick={handleNext}
              disabled={pageNumber >= numPages}
            >
              Next
            </button>
          </div>
          <p className="mt-2 text-gray-500">
            Page {pageNumber} of {numPages}
          </p>
          <div className="mt-4">
            {Array.from({ length: numPages }, (_, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedPages[index]}
                  onChange={() => toggleCheckbox(index)}
                  className="mr-2"
                />
                Page {index + 1}
              </label>
            ))}
              <button
                onClick={generatePDF}
                disabled={!selectedPages.some((page) => page)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
              >
                Generate New PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

