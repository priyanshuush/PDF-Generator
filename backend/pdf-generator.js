// Required Imports
const express = require("express");
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs/promises');
const path = require('path');
const bodyParser = require('body-parser');





// Initializing
const app = express();
const port = 3000;

// Parser for JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Storage information for pdf saving.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Getting the original file name of the uploaded file.
  },
});



// Multer used for saving files.
const upload = multer({ storage });



// Routes


// API for instructions
app.get('/', async (req, res) => {
  try {
    const instructions = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>API Instructions</title>
    </head>
    <body>
      <h1>Instructions for using the APIs:</h1>
      <ul>
        <li><code>'/upload'</code>: Upload your PDF file. Pass the PDF file in the body.</li>
        <li><code>'/pdf/:filename'</code>: Replace 'filename' with your uploaded file name to retrieve the file.</li>
        <li><code>'/extract-pages'</code>: Extract pages using this endpoint. Pass JSON data in the body.</li>
      </ul>
      <h2>JSON format for 'extract-pages':</h2>
      <pre>
        {
          "filename": "sample.pdf", // Name of the file you've uploaded and want to extract pages from.
          "selectedPages": [1, 3, 7], // Pages you want to extract.
          "newFilename": "custom_extracted_file.pdf" // Name of the new file.
        }
      </pre>
    </body>
    </html>
    `;
    res.status(200).send(instructions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Some Internal Server Error.');
  }
});


// API endpoint to upload a PDF file
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded'); // Check for if file is not uploaded.
    }

    const { originalname } = req.file;


    res.send(`File "${originalname}" uploaded successfully`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file');
  }
});





// API endpoint to retrieve the stored PDF file
app.get('/pdf/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`;

    const fileExists = await fs.access(filePath).then(() => true).catch(() => false); // Check for the file existence.
    if (!fileExists) {
      return res.status(404).send('File not found');
    }


    const pdf = await fs.readFile(filePath);
    res.contentType("application/pdf; charset=utf-8");
    res.send(pdf);  // Get the pdf file.


  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving file');
  }
});




// API endpoint to extract selected pages and create a new PDF
app.post('/extract-pages', async (req, res) => {

  try {
    const { filename, selectedPages, newFilename } = req.body; // JSON data to be passed by the user.

    if (!filename || !selectedPages || !Array.isArray(selectedPages)) {  // Check if the data is provdided by the user or not.
      return res.status(400).send('Invalid request data');
    }

    const filePath = `uploads/${filename}`;
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false); // Check for the file existence.
    if (!fileExists) {
      return res.status(404).send('File not found');
    }

    const pdf = await PDFDocument.load(await fs.readFile(filePath));
    const newPdf = await PDFDocument.create();

    // Get the pages from selected pages provided by the user and make them into a new pdf.
    for (const pageNumber of selectedPages) {
      if (pageNumber <= 0 || pageNumber > pdf.getPageCount()) {
        return res.status(400).send(`Invalid page number: ${pageNumber}`);
      }
      const [copiedPage] = await newPdf.copyPages(pdf, [pageNumber - 1]);
      newPdf.addPage(copiedPage);
    }


    const extension = path.extname(filename);
    const extractedFilename = newFilename || `extracted_${Date.now()}${extension}`;  // Name of the pdf provided by the user, and if not then name it based on time.
    const newFilePath = path.join(__dirname, 'uploads', extractedFilename);

    const newPdfBytes = await newPdf.save();
    await fs.writeFile(newFilePath, newPdfBytes);

    const downloadLink = `${req.protocol}://${req.get('host')}/download/${extractedFilename}`; // Generate download link

    res.json({ downloadLink }); // Send the download link in the response

    res.contentType('application/pdf');
    res.send(newPdfBytes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error extracting pages');
  }
});


// API endpoint to provide download link for extracted PDF
app.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', filename);

    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!fileExists) {
      return res.status(404).send('File not found');
    }

    res.download(filePath); // Provide the file for download
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving file for download');
  }
});



//   Server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


module.exports = app;