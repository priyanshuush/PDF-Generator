const express = require("express");
const router = express.Router();
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const User = require("../db/userModel");
const s3 = require("../config/aws-config");
const path = require("path");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { multerMiddleware, uploadPdf } = require("../middleware/upload.js");

//for img-pdf
const Jimp = require('jimp');

//pdf-word
const pdfParse = require('pdf-parse');
const { Document, Packer, Paragraph, TextRun } = require('docx');

//pdf-translate
const { translate } = require('@vitalets/google-translate-api');


// API endpoint to extract selected pages and create a new PDF
router.post("/extract-pages", async (req, res) => {
  try {
    const { filename, selectedPages } = req.body;

    // Check if filename and selectedPages are provided and selectedPages is an array
    if (!filename || !selectedPages || !Array.isArray(selectedPages)) {
      return res.status(400).send("Invalid request data");
    }

    // Construct the file path
    const filePath = `uploads/${filename}`;

    // Check if the file exists
    const fileExists = await fs.promises
      .access(filePath)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return res.status(404).send("File not found");
    }

    // Load the original PDF
    const pdf = await PDFDocument.load(await fs.promises.readFile(filePath));
    const newPdf = await PDFDocument.create();

    // Iterate through selected pages and copy them to the new PDF
    for (const pageNumber of selectedPages) {
      if (pageNumber <= 0 || pageNumber > pdf.getPageCount()) {
        return res.status(400).send(`Invalid page number: ${pageNumber}`);
      }
      const [copiedPage] = await newPdf.copyPages(pdf, [pageNumber - 1]);
      newPdf.addPage(copiedPage);
    }

    // Generate a new filename with original filename and current date
    const currentDate = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .slice(0, 19);
    const extension = path.extname(filename);
    const extractedFilename = `${path.basename(
      filename,
      extension
    )}_${currentDate}${extension}`;

    // Construct the new file path
    const newFilePath = path.join(__dirname, "uploads", extractedFilename);

    // Save the new PDF to the file system
    const newPdfBytes = await newPdf.save();
    await fs.promises.writeFile(newFilePath, newPdfBytes);

    // Construct the download link
    const downloadLink = `${req.protocol}://${req.get(
      "host"
    )}/download/${extractedFilename}`;

    res.json({ downloadLink });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error extracting pages");
  }
});

// API endpoint to extract selected pages and create a new PDF for logged in user.

router.post("/login/extract-pages", auth, async (req, res) => {
  try {
    const { filename, selectedPages } = req.body;

    if (!filename || !selectedPages || !Array.isArray(selectedPages)) {
      return res.status(400).send("Invalid request data");
    }

    const filePath = `uploads/${filename}`;

    const fileExists = await fs.promises
      .access(filePath)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return res.status(404).send("File not found");
    }

    const pdf = await PDFDocument.load(await fs.promises.readFile(filePath));

    const newPdf = await PDFDocument.create();

    for (const pageNumber of selectedPages) {
      if (pageNumber <= 0 || pageNumber > pdf.getPageCount()) {
        return res.status(400).send(`Invalid page number: ${pageNumber}`);
      }

      const [copiedPage] = await newPdf.copyPages(pdf, [pageNumber - 1]);

      newPdf.addPage(copiedPage);
    }

    const extension = path.extname(filename);

    const currentDate = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .slice(0, 19);

    const extractedFilename = `extracted_${currentDate}${extension}`;

    const newFilePath = path.join(__dirname, "uploads", extractedFilename);

    const newPdfBytes = await newPdf.save();

    await fs.promises.writeFile(newFilePath, newPdfBytes);

    const downloadLink = `${req.protocol}://${req.get(
      "host"
    )}/download/${extractedFilename}`;

    if (req.user) {
      const foundUser = await User.findOne({ email: req.user.userEmail });

      if (foundUser) {
        let userId = foundUser._id;
        const newPdfDoc = new PDFModel({
          userID: userId,
          email: req.user.userEmail,
          title: extractedFilename,
          // uploadDate: uploadDate,
          downloadURL: downloadLink,
        });

        await newPdfDoc.save();

        console.log("User data saved:", foundUser);
      } else {
        console.log("User not found");
      }
    }

    res.json({ downloadLink });
  } catch (error) {
    console.error(error);

    res.status(500).send("Error extracting pages");
  }
});

// API endpoint to merge multiple PDFs
router.post(
  "/merge",
  multerMiddleware.array("pdfs"),
  auth,
  async (req, res) => {
    try {
      if (!req.files || req.files.length < 2) {
        return res.status(400).send("At least two PDF files are required");
      }

      const mergedPdf = await PDFDocument.create();

      for (const file of req.files) {
        const pdfDoc = await PDFDocument.load(file.buffer);
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const resultPDF = await mergedPdf.save();

      const email = req.user.userEmail;
      console.log("Email:", email);
      const result = await uploadPdf(resultPDF, "Merged PDF", email);

      if (result.success) {
        try {
          const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: result.message,
            Expires: 60 * 60,
          };
          const url = s3.getSignedUrl("getObject", params);
          res.status(200).send(url);
        } catch (error) {
          console.error(error);
        }
      } else {
        res.status(500).send(result.message);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error merging files");
    }
  }
);

//img-pdf

router.post("/images-to-pdf", multerMiddleware.array("images"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("Please upload at least one image.");
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      const image = await Jimp.read(Buffer.from(file.buffer));

      // Resize image to fit A4 size while maintaining aspect ratio

      const maxWidth = 595; // Width of A4 in points

      const maxHeight = 842; // Height of A4 in points

      image.scaleToFit(maxWidth, maxHeight);

      const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

      const pngImage = await pdfDoc.embedPng(imageBuffer);

      const { width, height } = pngImage;

      const page = pdfDoc.addPage([width, height]);

      page.drawImage(pngImage, { x: 0, y: 0 });

      // If there are more images, add another blank page for the next image

      if (file !== req.files[req.files.length - 1]) {
        pdfDoc.addPage();
      }
    }

    const pdfBytes = await pdfDoc.save();

    const { email } = req.body;

    const result = await uploadPdf(pdfBytes, "ImagesToPDF.pdf", email);

    if (result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(500).send(result.message);
    }
  } catch (error) {
    console.error(error);

    res.status(500).send("Error converting images to PDF");
  }
});

// PDF to Word

router.post("/pdf-to-word", multerMiddleware.single("pdf"), async (req, res) => {
  try {
    const { file } = req; // Multer handles file uploads and attaches the file to req.file

    if (!file) {
      return res.status(400).send("Please upload a PDF file.");
    }
    const pdfBuffer = file.buffer;

    // Parse the PDF buffer to extract text

    const pdfData = await pdfParse(pdfBuffer);

    const extractedText = pdfData.text;

    // Create a new Word document

    const doc = new Document({
      sections: [
        {
          properties: {},

          children: [
            new Paragraph({
              children: [new TextRun(extractedText)],
            }),
          ],
        },
      ],
    });

    // Generate the Word document buffer

    const docxBuffer = await Packer.toBuffer(doc);

    // Send the Word document back to the client

    res.setHeader("Content-Disposition", "attachment; filename=converted.docx");

    res.type(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    res.send(docxBuffer);
  } catch (error) {
    console.error(error);

    res.status(500).send("Error converting PDF to Word");
  }
});



// API endpoint to translate PDF text
router.post("/pdf-to-translate", multerMiddleware.single("pdf"), async (req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).send("Please upload a PDF file.");
    }

    const pdfBuffer = file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text;

    const translatedText = await translate(extractedText, { to: "es" }).then(
      (res) => res.text
    );

    res.send(translatedText);
  } catch (error) {
    console.error(error);

    res.status(500).send("Error translating PDF text");
  }
});

//password protected pdf

router.post("/protectedpdf", multerMiddleware.single("pdf"), async (req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).send("Please upload a PDF file.");
    }

    const password = req.body.Password;

    if (!password) {
      return res.status(400).send("Please provide a password.");
    }

    const pdfBytes = file.buffer; // Assuming you're using multer.memoryStorage()

    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Encrypt the PDF with the provided password

    const encryptedPdfBytes = await pdfDoc.save({
      password: password,

      useUserPassword: true,
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=protected_${file.originalname}`
    );

    res.send(Buffer.from(encryptedPdfBytes));
  } catch (error) {
    console.error(error);

    res.status(500).send("Error setting password to PDF");
  }
});

module.exports = router;
