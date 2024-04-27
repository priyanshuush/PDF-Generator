"use client"

import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DropzoneArea = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      if (file.type === 'application/pdf') {

        axios.post(`https://localhost:8000/upload`, file, {
          headers: {
            'Content-Type': 'application/pdf'
          }
        })
        .then(response => {
          console.log(response.data);
          setPdfFile(file);
          setError(null);
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          setError('Invalid file type. Please upload a PDF file.');
        });
      }
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Failed to load PDF:', error);
    setError('Failed to load PDF file. Please try a different file.');
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCheckboxChange = (pageNumber) => {
    if (selectedPages.includes(pageNumber)) {
      setSelectedPages(selectedPages.filter(page => page !== pageNumber));
    } else {
      setSelectedPages([...selectedPages, pageNumber]);
    }
  };

  return (
    <div className="flex-grow mx-auto h-screen p-4">
      {!pdfFile && (
        <Dropzone onDrop={onDrop} accept="application/pdf" maxFiles={1} maxSize={5242880} multiple="false">
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center h-full ${isDragActive ? 'border-blue-400' : 'border-gray-300'} border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}
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
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Only PDF files are allowed</p>
              </div>
            </div>
          )}
        </Dropzone>
      )}

      {error && (
        <div className="mt-4 px-4 py-3 rounded-md bg-red-100 border border-red-400 text-red-700 text-sm font-medium" role="alert">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {pdfFile && (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundRepeat: 'no-repeat' }}>
          <div style={{ width: '50%', maxHeight: '50%' }}>
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
            >
              <div style={{ position: 'relative' }}>
                {/* Render only the current page */}
                <Page pageNumber={currentPage} width={800} renderTextLayer={false}
                  renderAnnotationLayer={false}
                  customTextRenderer={false} />

                {/* Checkbox for selecting the page */}
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(currentPage)}
                    onChange={() => handleCheckboxChange(currentPage)}
                  />
                </div>
              </div>
            </Document>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-4 mb-4">
              <button
                className="px-4 py-2 border border-gray-600 rounded bg-gray-500 hover:bg-gray-700"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 border border-gray-600 rounded bg-gray-500 hover:bg-gray-700"
                onClick={handleNextPage}
                disabled={currentPage === numPages}
                style={{ marginLeft: '99%' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropzoneArea;
