import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import "tailwindcss/tailwind.css";

const DownloadPage = () => {
  const router = useRouter();
  const { url } = router.query;

  useEffect(() => {
    if (url) {
      // Automatically redirect to the download link if available
      window.location.href = decodeURIComponent(url);
    }
  }, [url]);

  if (!url) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-4">Invalid or missing download link</h1>
          <Link href="/compress-pdf">
            <a className="text-blue-500 underline">Go back to compress PDF page</a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Your PDF is being downloaded...</h1>
        <p>If the download does not start automatically, <a href={decodeURIComponent(url)} className="text-blue-500 underline">click here</a>.</p>
      </div>
    </div>
  );
};

export default DownloadPage;
