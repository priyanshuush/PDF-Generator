import React, { useState, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import "tailwindcss/tailwind.css";
import { SaveOutline, TrashOutline } from 'heroicons-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const TextExtractor = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [extractedText, setExtractedText] = useState('');
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

  const extractTextFromPage = async () => {
    if (!file) return;

    try {
      const response = await fetch(file);
      const blob = await response.blob();
      const text = await extractTextFromBlob(blob);
      setExtractedText(text);
    } catch (error) {
      console.error('Error extracting text:', error);
    }
  };

  const extractTextFromBlob = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const pdfData = new Uint8Array(event.target.result);
        pdfjs.getDocument({ data: pdfData }).promise.then((pdf) => {
          pdf.getPage(pageNumber).then((page) => {
            page.getTextContent().then((textContent) => {
              const textItems = textContent.items.map(item => item.str);
              resolve(textItems.join('\n'));
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      };
      reader.readAsArrayBuffer(blob);
    });
  };

  const handleSaveDownload = () => {
    // Placeholder function for save and download functionality
    alert('Save and Download functionality');
  };

  const handleClearPDF = () => {
    setFile(null);
    setExtractedText('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputFileRef.current.click()}
          className="w-full max-w-lg p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer text-center bg-white"
        >
          <p className="text-gray-500">Drag and drop your PDF file here or click to select file</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFilesUpload}
            className="hidden"
            ref={inputFileRef}
          />
        </div>
      ) : (
        <div className="w-full max-w-5xl flex bg-white rounded-lg shadow-lg p-4">
          <div className="w-2/3 p-4 border-r border-gray-300">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              className="border-2 border-gray-300 rounded-lg mb-4"
            >
              <Page pageNumber={pageNumber} />
            </Document>
            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={() => changePage(-1)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={extractTextFromPage}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded focus:outline-none"
              >
                Extract Text
              </button>
              <button
                type="button"
                disabled={pageNumber >= numPages}
                onClick={() => changePage(1)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
          <div className="w-1/3 p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">PDF Text Extraction</h2>
              <div className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50 h-80 overflow-y-auto">
                {extractedText && (
                  <pre className="whitespace-pre-line">{extractedText}</pre>
                )}
                {!extractedText && <p>No text extracted</p>}
              </div>
            </div>
            <div className="flex flex-col items-center mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none flex items-center mb-2"
                onClick={handleSaveDownload}
              >
                <SaveOutline className="w-5 h-5 mr-2" /> Save & Download
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none flex items-center"
                onClick={handleClearPDF}
              >
                <TrashOutline className="w-5 h-5 mr-2" /> Clear PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextExtractor;
