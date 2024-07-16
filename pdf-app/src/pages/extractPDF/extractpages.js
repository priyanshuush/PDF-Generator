"use client";
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
import Cookies from 'js-cookie';
import DropzoneComponent from '@/components/Dropzone';
import "tailwindcss/tailwind.css";
import CustomNavbar from '@/components/CustomNavbar';
import { AuthProvider } from '@/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ExtractPDF = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);

  const onFileUpload = (file) => {
    setPdfFile(file); // Set the file for previewing
    setError(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    setError(null);
  };

  /**
   * Splits the PDF file based on the selected pages and downloads the result.
   *
   * @returns {void}
   */
  const splitPdf = () => {
    // Check if a PDF file is selected
    if (pdfFile) {
      const filename = pdfFile.name;

      // Prepare the data to be sent in the request
      const data = {
        filename: filename, // The name of the PDF file
        selectedPages: selectedPages, // The pages to be extracted
      };

      // Set the URL and configuration based on whether a user is logged in or not
      let url = 'http://localhost:8000/extract-pages'; // Default URL
      let config = {}; // Default configuration

      const token = Cookies.get('token'); // Get the user's token
      if (token) {
        url = 'http://localhost:8000/login/extract-pages'; // URL for logged-in users
        config = {
          headers: {
            Authorization: `Bearer ${token}`, // Set the authorization header with the token
          },
        };
      }

      // Send the request to split the PDF and handle the response
      axios.post(url, data, config)
        .then(response => {
          window.open(response.data.downloadLink, '_blank'); // Open the downloaded PDF in a new tab
          setError(null); // Clear any error messages
          setPdfFile(null); // Clear the selected PDF file
        })
        .catch(error => {
          console.error('Error splitting PDF:', error); // Log any errors that occur during the request
          setError('Error splitting PDF. Please try again.'); // Display an error message to the user
        });
    }
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
    <>
    {/* <CustomNavbar /> */}
    <div className="flex-grow mx-auto h-screen p-4">
      {!pdfFile && <DropzoneComponent onFileUpload={onFileUpload} />}
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
                <Page
                  pageNumber={currentPage}
                  width={800}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  customTextRenderer={false}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(currentPage)}
                    onChange={() => handleCheckboxChange(currentPage)}
                  />
                </div>
              </div>
            </Document>
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
                onClick={splitPdf}
                style={{ marginLeft: '45%' }}
              >
                Split PDF
              </button>
              <button
                className="px-4 py-2 border border-gray-600 rounded bg-gray-500 hover:bg-gray-700"
                onClick={handleNextPage}
                disabled={currentPage === numPages}
                style={{ marginLeft: '45%' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ExtractPDF;
