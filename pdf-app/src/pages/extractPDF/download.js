import React, { useEffect } from "react";
import { useRouter } from "next/router";

const DownloadPage = () => {
  const router = useRouter();
  const { url } = router.query;

  useEffect(() => {
    if (url) {
      window.location.href = decodeURIComponent(url);
    }
  }, [url]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-xl font-bold text-center mb-4">Download Your Extracted PDF</h1>
        <p className="text-center">
          Your file is being prepared for download. If the download does not start automatically,{" "}
          <a href={decodeURIComponent(url)} className="text-blue-500 underline">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default DownloadPage;
