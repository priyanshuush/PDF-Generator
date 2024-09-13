// Required Imports
const express = require("express");
const multer = require('multer');
const bodyParser = require('body-parser');
const dbConnect = require("./db/dbConnect");
const PDFModel = require("./db/pdfModel");
const userModel = require("./db/userModel");

const User = require("./db/userModel");
const { v4: uuidv4 } = require('uuid');
const s3 = require('./config/aws-config');

const auth = require("./middleware/auth");
const session = require('express-session');
const passport = require("passport");
const FormData = require('form-data');
const axios = require('axios');



require('./config/Outh')


require('dotenv').config()



// Initializing
const app = express();

const port = 8000;
app.use(session({ secret: 'cats' }));
app.use(passport.initialize());
app.use(passport.session());

dbConnect();


// CORS Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});



// Parser for JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Multer setup to handle file uploads
const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage });

// Routes
const authRoutes = require('./routes/authentication');
const toolRoutes = require('./routes/tools');

app.use('/auth', authRoutes);
app.use('/tools', toolRoutes);





app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const { email } = req.body;
    const result = await uploadPdf(req.file.buffer, req.file.originalname, email);

    if (result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(500).send(result.message);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file');
  }
});



// app.get('/allpdfs', auth, async (req, res) => {
//   try {
//     if (req.user) {
//       const foundDocs = await PDFModel.find({ email: req.user.userEmail });
//       if (foundDocs && foundDocs.length > 0) {
//         const downloadUrls = foundDocs.flatMap(doc => doc.downloadURL || []);
//         res.json(downloadUrls);
//       } else {
//         console.log('No documents found');
//         res.status(404).send('No documents found');
//       }
//     } else {
//       res.status(401).send('Unauthorized');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving files');
//   }
// });

// API endpoint to get all PDF links
app.get('/allpdfs', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    console.log(req.user.userEmail)

    const foundDocs = await PDFModel.find({ email: req.user.userEmail }).skip(skip).limit(limit);
    console.log(foundDocs)

    if (foundDocs && foundDocs.length > 0) {
      const s3DownloadUrls = await Promise.all(foundDocs.map(async (doc) => {
        try {
          const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: doc.s3Key,
            Expires: 60 * 60 
          };
          const url = s3.getSignedUrl('getObject', params);
          console.log(`Generated URL for ${doc.s3Key}: ${url}`);
          return {
            title: doc.title,
            downloadURL: url
          };
        } catch (error) {
          console.error(`Error generating signed URL for ${doc.s3Key}:`, error);
          return null;
        }
      }));

      const validUrls = s3DownloadUrls.filter(urlObj => urlObj !== null);

      if (validUrls.length > 0) {
        res.json(validUrls);
      } else {
        console.log('No valid document URLs found');
        res.status(404).send('No valid document URLs found');
      }
    } else {
      console.log('No documents found');
      res.status(404).send('No documents found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving files');
  }
});



// API endpoint to retrieve the stored PDF file from AWS S3
app.get('/pdf/:filename', auth, async (req, res) => {
  try {
    const { filename } = req.params;

    // Fetch PDF metadata from MongoDB
    const pdfDoc = await PDFModel.findOne({ title: filename });

    if (!pdfDoc) {
      return res.status(404).send('File not found');
    }

    // Generate a signed URL to retrieve the PDF from S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: pdfDoc.s3Key,
      Expires: 60 * 5 // URL expires in 5 minutes
    };

    const url = await s3.getSignedUrlPromise('getObject', params);

    // Redirect the user to the signed URL for download
    res.redirect(url);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving file');
  }
});



// API endpoint to delete the stored PDF file
app.delete('/pdf/:filename', auth, async (req, res) => {
  try {
    const { filename } = req.params;

    // Construct the file key based on your logic
    const s3Key = filename;

    // Delete the file from the S3 bucket
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    };

    try {
      await s3.deleteObject(params).promise();
      console.log(`File "${filename}" deleted from S3 successfully`);
    } catch (s3Error) {
      console.error(`Error deleting file "${filename}" from S3:`, s3Error);
      return res.status(500).send('Error deleting file from S3');
    }

    // Find and delete the document from the MongoDB database
    const foundDoc = await PDFModel.findOneAndDelete({
      email: req.user.userEmail,
      s3Key: s3Key
    });

    if (foundDoc) {
      console.log('Document deleted from MongoDB successfully');
    } else {
      console.log('Document not found in MongoDB');
      return res.status(404).send('Document not found in database');
    }

    res.send(`File "${filename}" deleted successfully`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting file');
  }
});



// API endpoint to provide download link for extracted PDF
app.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { email } = req.query;

    let userId = null;
    if (email) {
      const user = await User.findOne({ email: email });
      if (user) {
        userId = user._id;
      } else {
        return res.status(404).send('User not found for the provided email ID');
      }
    }

    const pdfDoc = await PDFModel.findOne({ userID: userId, title: filename });
    if (!pdfDoc) {
      return res.status(404).send('File not found');
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: pdfDoc.s3Key,
      Expires: 60 * 60, // URL expires in 1 hour
    };

    const url = s3.getSignedUrl('getObject', params);
    res.status(200).send({ downloadURL: url });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    res.status(500).send('Error generating pre-signed URL');
  }
});



//   Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




module.exports = app;