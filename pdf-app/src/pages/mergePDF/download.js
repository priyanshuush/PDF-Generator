import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CloudDownloadOutline } from "heroicons-react";
import "tailwindcss/tailwind.css";

const DownloadPage = () => {
  const router = useRouter();
  const [decodedUrl, setDecodedUrl] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const { url } = router.query;
      if (url) {
        setDecodedUrl(decodeURIComponent(url));
      }
    }
  }, [router.isReady, router.query]);

  const handleDownload = () => {
    if (decodedUrl) {
      window.open(decodedUrl, '_blank');
    }
  };

  return (
    <>
      <Head>
        <title>DocuMane - Download PDF</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Your PDF is Ready!</h1>
          <p className="text-gray-600 mb-8">Click the button below to download your merged PDF file.</p>
          {decodedUrl ? (
            <button 
              onClick={handleDownload}
              className="inline-flex items-center bg-light-component text-white px-6 py-3 rounded-full shadow-md hover:bg-dark-component transition duration-300"
            >
              <CloudDownloadOutline className="w-6 h-6 mr-2" />
              Download PDF
            </button>
          ) : (
            <p className="text-red-500">No URL provided.</p>
          )}
          <div className="mt-8">
            <button
              onClick={() => router.push('/mergePDF/mergepdf')}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
            >
              Merge Another PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadPage;