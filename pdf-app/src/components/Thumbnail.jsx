import React, { useEffect, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';

const Thumbnail = ({ pdfLink }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        // Asynchronously load the PDF document
        const loadingTask = pdfjs.getDocument(pdfLink);
        const pdf = await loadingTask.promise;

        // Fetch the first page of the PDF
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });

        // Create a canvas element to render the page
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the page to the canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Convert the canvas content to a data URL
        const dataUrl = canvas.toDataURL('image/png');
        setThumbnailUrl(dataUrl);
      } catch (error) {
        console.error('Error generating thumbnail:', error);
        setThumbnailUrl(null);
      }
    };

    generateThumbnail();
  }, [pdfLink]);

  return thumbnailUrl ? (
    <img src={thumbnailUrl} alt="PDF Preview" style={{ width: '100%', height: '100%' }} />
  ) : (
    <div>Loading...</div>
  );
};

export default Thumbnail;
