const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const s3 = require('../config/aws-config');
const User = require("../db/userModel");
const PDFModel = require("../db/pdfModel");
const FormData = require('form-data');
const axios = require('axios');

const multerMiddleware = multer({ storage: multer.memoryStorage() });

async function uploadPdf(fileBuffer, originalname, email) {
  try {
    let userId = null;
    let sessionToken = '';
    let user = null;

    if (email) {
      user = await User.findOne({ email: email });
    }

    if (user) {
      userId = user._id;

      const fileExtension = originalname.split('.').pop();
      const filename = `${uuidv4()}.${fileExtension}`;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: filename,
        Body: fileBuffer,
        ACL: 'private'
      };

      const data = await s3.upload(params).promise();
      const s3Key = data.Key;
      const downloadLink = data.Location;

      const newPdfDoc = new PDFModel({
        userID: userId,
        email: email,
        title: originalname,
        s3Key: s3Key,
        downloadURL: downloadLink,
      });

      await newPdfDoc.save();
      return { success: true, message: `${s3Key}` };
    } else {
      sessionToken = uuidv4();

      const filename = `${uuidv4()}.pdf`;
      const formData = new FormData();
      formData.append('file', fileBuffer, originalname);

      const response = await axios.post('https://tmpfiles.org/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const tmpfileDownloadURL = response.data.data.URL;

      const newPdfDoc = new PDFModel({
        title: originalname,
        downloadURL: tmpfileDownloadURL,
        sessionToken: sessionToken,
        shouldExpire: true
      });

      await newPdfDoc.save();
      return { success: true, message: `File "${originalname}" uploaded successfully to tmpfiles.org. Download URL: ${tmpfileDownloadURL}` };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Error uploading file' };
  }
}

module.exports = {
  multerMiddleware,
  uploadPdf
};
