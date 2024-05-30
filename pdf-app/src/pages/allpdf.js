import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import Head from 'next/head';
import "tailwindcss/tailwind.css";
import CustomNavbar from '@/components/CustomNavbar';
import { AuthProvider } from '@/AuthContext';
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InfiniteScroll from 'react-infinite-scroll-component';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const AllPdfPage = () => {
  const [pdfLinks, setPdfLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const fetchPdfLinks = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8000/allpdfs?page=${currentPage}&limit=8`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHasMore(response.data.length === 8);
        setPdfLinks(prevLinks => {
          const uniqueLinks = response.data.filter(newLink => !prevLinks.some(oldLink => oldLink === newLink));
          return [...prevLinks, ...uniqueLinks];
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching PDF links:', error);
        setLoading(false);
      }
    };

    fetchPdfLinks();
  }, [currentPage]);

  const fetchMoreData = () => {
    setTimeout(() => {
      setCurrentPage(prevPage => prevPage + 1);
    }, 2000);
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  async function handleDeletePdf(pdfLink) {
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Please log in to delete a PDF.');
        return;
      }

      const fileName = pdfLink.split('/').pop();
      await axios.delete(`http://localhost:8000/pdf/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPdfLinks(prevLinks => prevLinks.filter(link => link !== pdfLink));
    } catch (error) {
      console.error('Error deleting PDF:', error);
      toast.error('Failed to delete the PDF. Please try again.');
    }
  }

  function handleNextPage() {
    setCurrentPage(prevPage => prevPage + 1);
  }

  function handlePreviousPage() {
    setCurrentPage(prevPage => prevPage - 1);
  }

  function closeOverlay() {
    setSelectedPdf(null);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pdfLinks.length && !loading) {
    return <div>Please log in to show your saved PDFs</div>;
  }

  return (
    <AuthProvider>
      <ToastContainer />
      <>
        <CustomNavbar />
        <br />
        <Head>
          <title>All PDFs</title>
        </Head>
        <div>
          <InfiniteScroll
            dataLength={pdfLinks.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          >
            <div className="grid grid-cols-4 gap-4">
              {pdfLinks.map((link, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-md">
                  <img
                    src="https://developing8.org/wp-content/themes/education-mind-child/images/file-icons/pdf.png"
                    alt="PDF Icon"
                    className="mx-auto mb-2 cursor-pointer"
                    onClick={() => setSelectedPdf(link)}
                  />
                  <h2 className="text-center">{link.split('/').pop().replace('.pdf', '')}</h2>
                  <div className="flex justify-center">
                    <button
                      onClick={() => window.open(link, '_blank')}
                      style={{ backgroundColor: 'black', color: 'white' }}
                      className="btn btn-primary mt-2 block mx-auto text-center px-4 py-2 rounded-md"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDeletePdf(link)}
                      style={{ backgroundColor: 'red', color: 'white' }}
                      className="btn btn-danger mt-2 block mx-auto text-center px-4 py-2 rounded-md"
                    >
                      Delete PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
          {selectedPdf && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg shadow-lg relative" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <button onClick={closeOverlay} className="absolute top-0 right-0 p-2">X</button>
                <Document
                  file={selectedPdf}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error) => console.error('Error loading PDF:', error)}
                >
                  <Page pageNumber={currentPage} width={800} renderTextLayer={false} renderAnnotationLayer={false} />
                </Document>
                <div className="flex justify-between mt-4">
                  <button onClick={handlePreviousPage} disabled={currentPage <= 1}>Previous</button>
                  <button onClick={handleNextPage} disabled={currentPage >= numPages}>Next</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </AuthProvider>
  );
};

export default AllPdfPage;
