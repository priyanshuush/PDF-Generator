import React, { useState, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import {
  FiTrash2, FiEdit, FiPenTool, FiLink, FiImage, FiEdit3, FiSquare, FiFileText, FiArrowLeft, FiArrowRight, FiRotateCcw,
} from 'react-icons/fi';
import "tailwindcss/tailwind.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const EditPDF = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const inputFileRef = useRef(null);

  const handleFilesUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const uploadedFile = event.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const handleSaveAndDownload = () => {
    // Implement the save and download functionality here
    console.log("Save and Download button clicked");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputFileRef.current.click()}
          className="w-full max-w-lg p-8 border-4 border-dashed border-gray-400 rounded-lg cursor-pointer text-center bg-white hover:bg-gray-50 transition duration-300"
        >
          <p className="text-gray-500 font-semibold">Drag and drop your PDF file here or click to select file</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFilesUpload}
            className="hidden"
            ref={inputFileRef}
          />
        </div>
      ) : (
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center mb-6 border-b-2 pb-4">
            <div className="flex items-center border border-gray-300 rounded p-2 space-x-2 mb-4">
              <button
                className="flex flex-col items-center text-blue-600 p-2 rounded hover:bg-blue-100 transition duration-300"
                title="Add Text"
              >
                <FiEdit />
                <span className="text-xs">Add Text</span>
              </button>
              <button
                className="flex flex-col items-center text-blue-600 p-2 rounded hover:bg-blue-100 transition duration-300"
                title="Add Signature"
              >
                <FiPenTool />
                <span className="text-xs">Add Signature</span>
              </button>
              <button
                className="flex flex-col items-center text-blue-600 p-2 rounded hover:bg-blue-100 transition duration-300"
                title="Add Links"
              >
                <FiLink />
                <span className="text-xs">Add Links</span>
              </button>
              <button
                className="flex flex-col items-center text-blue-600 p-2 rounded hover:bg-blue-100 transition duration-300"
                title="Add Images"
              >
                <FiImage />
                <span className="text-xs">Add Images</span>
              </button>
              <button
                className="flex flex-col items-center text-blue-600 p-2 rounded hover:bg-blue-100 transition duration-300"
                title="Annotate"
              >
                <FiEdit3 />
                <span className="text-xs">Annotate</span>
              </button>
              <button
                className="flex flex-col items-center text-blue-600 p-2 rounded hover:bg-blue-100 transition duration-300"
                title="Add Shapes"
              >
                <FiSquare />
                <span className="text-xs">Add Shapes</span>
              </button>
              <button
                className="flex flex-col items-center text-blue-600 p-2 rounded hover:bg-blue-100 transition duration-300"
                title="Add Forms"
              >
                <FiFileText />
                <span className="text-xs">Add Forms</span>
              </button>
              <button
                className="flex flex-col items-center text-blue-600 p-2 rounded hover:bg-blue-100 transition duration-300"
                title="Undo"
              >
                <FiRotateCcw />
                <span className="text-xs">Undo</span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={() => changePage(-1)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-full p-4 border-2 border-gray-300 rounded-lg overflow-hidden mx-8">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                className="transition-transform duration-500"
              >
                <Page pageNumber={pageNumber} />
              </Document>
            </div>
            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={() => changePage(1)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              <FiArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSaveAndDownload}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Save and Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPDF;
