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

const MergePDF = () => {
  const [files, setFiles] = useState([]);
  const router = useRouter();

  const handleFilesUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [
      ...prevFiles,
      ...selectedFiles.map((file) => ({ file, selected: false })),
    ]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [
      ...prevFiles,
      ...droppedFiles.map((file) => ({ file, selected: false })),
    ]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileRemove = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleFileSelect = (index) => {
    setFiles((prevFiles) =>
      prevFiles.map((fileObj, i) =>
        i === index ? { ...fileObj, selected: !fileObj.selected } : fileObj
      )
    );
  };

  const handleSelectAll = () => {
    setFiles((prevFiles) =>
      prevFiles.map((fileObj) => ({ ...fileObj, selected: true }))
    );
  };

  const handleDeselectAll = () => {
    setFiles((prevFiles) =>
      prevFiles.map((fileObj) => ({ ...fileObj, selected: false }))
    );
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleMerge = () => {
    const selectedFiles = files.filter((fileObj) => fileObj.selected);

    if (selectedFiles.length < 2) {
      alert("Please select at least two files to merge.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((fileObj) => {
      formData.append("pdfs", fileObj.file);
    });

    const token = Cookies.get("token");
    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    axios.post("https://pdf-generator-vyog.onrender.com/tools/merge", formData, {

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        router.push({
          pathname: "/mergePDF/download",
          query: { url: encodeURIComponent(response.data) },
        });
      })
      .catch((error) => {
        toast.error("File Merge Unsucessful!");
        console.log(error);
      });

    console.log("Selected files for merging:", selectedFiles);
  };

  return (
    <>
      <ToastContainer />
      <Head>
        <title>DocuMane - Merge PDFs</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                onChange={(e) =>
                  e.target.checked ? handleSelectAll() : handleDeselectAll()
                }
                className="form-checkbox h-5 w-5 text-blue-500 mx-2"
              />
              <span className="font-bold text-lg px-12">Name</span>
            </label>
            <div className="flex space-x-4 mr-2">
              <button
                className="bg-light-component text-white px-4 py-2 rounded hover:bg-dark-component mx-4"
                onClick={handleMerge}
              >
                Merge & Download
              </button>
              <button onClick={handleRemoveAll} className="text-red-500">
                <TrashOutline className="w-6 h-6" />
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
              Drag and drop your PDF files here or click to select files
            </p>
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={handleFilesUpload}
              className="hidden"
              id="file-upload"
            />
          </div>

          {files.length > 0 && (
            <div className="mb-4">
              <ul className="space-y-2">
                {files.map((fileObj, index) => (
                  <li
                    key={index}
                    className={`flex justify-between items-center bg-gray-200 p-2 rounded ${
                      fileObj.selected ? "bg-blue-100" : ""
                    }`}
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fileObj.selected}
                        onChange={() => handleFileSelect(index)}
                        className="form-checkbox h-5 w-5 text-blue-500 mr-2"
                      />
                      <span className="px-10">{fileObj.file.name}</span>
                    </label>
                    <button
                      onClick={() => handleFileRemove(index)}
                      className="text-red-500"
                    >
                      <TrashOutline className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MergePDF;
