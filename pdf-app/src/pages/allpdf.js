
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';


import 'pdfjs-dist/webpack';
import Head from 'next/head';



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


import "tailwindcss/tailwind.css";
import CustomNavbar from '@/components/CustomNavbar';

const AllPdfPage = () => {
 const [pdfLinks, setPdfLinks] = useState([]);
 const [loading, setLoading] = useState(true);
 const [selectedPdf, setSelectedPdf] = useState(null);
 const [numPages, setNumPages] = useState(null);
 const [currentPage, setCurrentPage] = useState(1);

 useEffect(() => {
    const fetchPdfLinks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return; 
        }

        const response = await axios.get('http://localhost:8000/allpdfs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPdfLinks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching PDF links:', error);
        setLoading(false);
      }
    };

    fetchPdfLinks();
 }, []);

 function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
 }

 function handleNextPage() {
    setCurrentPage(prevPage => prevPage + 1);
 }

 function handlePreviousPage() {
    setCurrentPage(prevPage => prevPage - 1);
 }

 if (loading) {
    return <div>Loading...</div>;
 }

 if (!pdfLinks.length && !loading) {
    return <div>Please log in to show your saved PDFs</div>;
 }

 function closeOverlay() {
  setSelectedPdf(null);
}

return (
  <><CustomNavbar /> <br/><><Head>
    <title>
      All PDFs
    </title>
  </Head><div>
      <div className="grid grid-cols-4 gap-4">
        {pdfLinks.map((link, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md cursor-pointer" onClick={() => setSelectedPdf(link)}>
            <img src="https://developing8.org/wp-content/themes/education-mind-child/images/file-icons/pdf.png" alt="PDF Icon" className="mx-auto mb-2" />
            <h2 className="text-center">{link.split('/').pop().replace('.pdf', '')}</h2>
            <button
              onClick={() => window.open(link, '_blank')}
              className="btn btn-grey mt-2 block mx-auto text-center"
            >
              Download
            </button>
          </div>
        ))}
      </div>
      {selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <button onClick={closeOverlay} className="absolute top-0 right-0 p-2">Close</button>
            <Document
              file={selectedPdf}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => console.error('Error loading PDF:', error)}
            >
              <Page pageNumber={currentPage} width={800} renderTextLayer={false}
                renderAnnotationLayer={false}
                customTextRenderer={false} />
            </Document>
            <div className="flex justify-between mt-4">
              <button onClick={handlePreviousPage} disabled={currentPage <= 1}>Previous</button>
              <button onClick={handleNextPage} disabled={currentPage >= numPages}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div></></>
);
};





export default AllPdfPage;
