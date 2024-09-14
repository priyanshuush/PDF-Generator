"use client";
import React, { useCallback } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Cookies from 'js-cookie';

const DropzoneComponent = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('pdf', file);
        const email = Cookies.get('email');
        formData.append('email', email);

        axios.post(`https://pdf-generator-vyog.onrender.com/upload`, formData)
          .then(response => {
            onFileUpload(file); // Call the parent callback function with the uploaded file
          })
          .catch(error => {
            console.error('Error uploading file:', error);
          });
      }
    }
  }, [onFileUpload]);

  return (
    <Dropzone onDrop={onDrop} accept={{ 'application/pdf': ['.pdf'] }} maxFiles={1} maxSize={5242880} multiple={false}>
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
  );
};

export default DropzoneComponent;
