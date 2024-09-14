import React, { useState } from "react";
import { TrashOutline } from "heroicons-react";
import "tailwindcss/tailwind.css";
import Head from "next/head";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const PdfToWord = () => {
  const [file, setFile] = useState(null);
  const router = useRouter();

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile({ file: selectedFile, selected: true });
    } else {
      toast.error("Please upload a valid PDF file.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile({ file: droppedFile, selected: true });
    } else {
      toast.error("Please upload a valid PDF file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleConvert = () => {
    if (!file) {
      toast.error("Please select a file to convert.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file.file);

    const token = Cookies.get("token");
    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    axios
      .post("https://pdf-generator-vyog.onrender.com/tools/pdf-to-word", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        router.push({
          pathname: "/pdfToWord/download",
          query: { url: encodeURIComponent(response.data) },
        });
      })
      .catch((error) => {
        toast.error("File Conversion Unsuccessful!");
        console.log(error);
      });
  };

  return (
    <>
      <ToastContainer />
      <Head>
        <title>DocuMane - Convert PDF to Word</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-lg px-12">Name</span>
            <div className="flex space-x-4 mr-2">
              <button
                className="bg-light-component text-white px-4 py-2 rounded hover:bg-dark-component mx-4"
                onClick={handleConvert}
              >
                Convert to Word
              </button>
            </div>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("file-upload").click()}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg mb-4 relative cursor-pointer"
          >
            <p className="text-gray-500 text-center">
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
            <div className="mb-4">
              <div className="flex justify-between items-center bg-gray-200 p-2 rounded">
                <span className="px-10">{file.file.name}</span>
                <button
                  onClick={handleFileRemove}
                  className="text-red-500"
                >
                  <TrashOutline className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PdfToWord;
