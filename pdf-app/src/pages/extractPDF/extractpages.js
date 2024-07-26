import React, { useState, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { TrashOutline } from "heroicons-react";
import "tailwindcss/tailwind.css";
import Head from "next/head";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ExtractPDF = () => {
  const [file, setFile] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedPages, setSelectedPages] = useState([]);
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState(null);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile({ file: selectedFile, selected: true });
      setFileUrl(URL.createObjectURL(selectedFile));
    } else {
      toast.error("Please upload a valid PDF file.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile({ file: droppedFile, selected: true });
      setFileUrl(URL.createObjectURL(droppedFile));
    } else {
      toast.error("Please upload a valid PDF file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileRemove = () => {
    setFile(null);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFileUrl(null);
    setNumPages(null);
    setPageNumber(1);
    setSelectedPages([]);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
  };

  const handleCheckboxChange = (event, pageIndex) => {
    if (event.target.checked) {
      setSelectedPages((prevSelectedPages) => [...prevSelectedPages, pageIndex + 1]);
    } else {
      setSelectedPages((prevSelectedPages) =>
        prevSelectedPages.filter((page) => page !== pageIndex + 1)
      );
    }
  };

  const handleExtractPages = () => {
    if (!file) {
      toast.error("Please select a file to extract pages from.");
      return;
    }
  
    if (selectedPages.length === 0) {
      toast.error("Please select at least one page to extract.");
      return;
    }
  
    const formData = new FormData();
    formData.append("pdf", file.file);
    formData.append("selectedPages", JSON.stringify(selectedPages));
  
    const token = Cookies.get("token");
    if (!token) {
      console.error("No authentication token found.");
      return;
    }
  
    axios
      .post("http://localhost:8000/tools/extract-pages", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        router.push({
          pathname: "/extractPDF/download",
          query: { url: encodeURIComponent(response.data) },
        });
      })
      .catch((error) => {
        toast.error("Page extraction unsuccessful!");
        console.log(error);
      });
  };


  const memoizedFile = useMemo(() => ({ url: fileUrl }), [fileUrl]);
  

  return (
    <>
      <ToastContainer />
      <Head>
        <title>DocuMane - Extract PDF</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-2xl px-12">Extract PDF</h1>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              onClick={handleExtractPages}
            >
              Extract Pages
            </button>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("file-upload").click()}
            className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg mb-6 relative cursor-pointer hover:border-blue-500 transition duration-300"
          >
            <p className="text-gray-500 text-center text-lg">
              Drag and drop your PDF file here or click to select file
            </p>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
          </div>

          {file && (
            <div className="mb-6">
              <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                <span className="px-4 font-medium">{file.file.name}</span>
                <button onClick={handleFileRemove} className="text-red-500 hover:text-red-600 transition duration-300">
                  <TrashOutline className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {fileUrl && (
            <div className="flex flex-col items-center">
              <Document
                file={memoizedFile}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page 
                  pageNumber={pageNumber} 
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  customTextRenderer={false}
                />
              </Document>

              <div className="flex justify-between items-center mt-6 w-full">
                <button
                  onClick={handlePreviousPage}
                  disabled={pageNumber <= 1}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="font-medium">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={pageNumber >= numPages}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              <div className="mt-8 w-full">
                <h2 className="text-xl font-semibold mb-4">Select Pages to Extract</h2>
                <div className="grid grid-cols-4 gap-4">
                  {Array.from(new Array(numPages), (el, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`page-${index + 1}`}
                        onChange={(event) => handleCheckboxChange(event, index)}
                        className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <label htmlFor={`page-${index + 1}`} className="ml-2 text-gray-700">
                        Page {index + 1}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExtractPDF;
