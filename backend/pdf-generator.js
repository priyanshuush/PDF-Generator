// Required Imports
const express = require("express");
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const dbConnect = require("./db/dbConnect");
const PDFModel = require("./db/pdfModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/userModel");
const { v4: uuidv4 } = require('uuid');
const s3 = require('./aws-config');

const auth = require("./auth");
const session = require('express-session');
const passport = require("passport");
const pdfModel = require("./db/pdfModel");
const FormData = require('form-data');
const axios = require('axios');

require('./Outh')


require('dotenv').config()


console.log(process.env.DB_URL);

// Initializing
const app = express();
const port = 8000;
app.use(session({ secret: 'cats' }));
app.use(passport.initialize());
app.use(passport.session());

dbConnect();


// Curb Cores Error by adding a header here
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







app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const { email } = req.body;
    let userId = null;
    let sessionToken = '';
    let user = null;

    if (email) {
      user = await User.findOne({ email: email });
    }

    if (user) {
      userId = user._id;
      const { originalname } = req.file;
      const fileExtension = path.extname(originalname);
      const filename = `${uuidv4()}${fileExtension}`;
      
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: filename,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'private'
      };

      s3.upload(params, async (err, data) => {
        if (err) {
          console.error('Error uploading to S3:', err);
          return res.status(500).send('Error uploading file');
        }

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
        res.status(200).send(`File "${originalname}" uploaded successfully`);
      });
    } else {
      sessionToken = uuidv4();
      const { originalname } = req.file;
      const fileExtension = path.extname(originalname);
      const filename = `${fileExtension}${fileExtension}`; 
      
      const formData = new FormData();
      formData.append('file', req.file.buffer, originalname);

      axios.post('https://tmpfiles.org/api/v1/upload', formData, {
        headers: {
          ...formData.getHeaders()
        }
      }).then(response => {
        if (response.data.status !== 'success') {
          res.status(500).send('Error uploading file to tmpfiles.org');
        }

        else {
          const tmpfileDownloadURL = response.data.data.url;

          const newPdfDoc = new PDFModel({
            title: originalname,
            downloadURL: tmpfileDownloadURL,
            sessionToken: sessionToken,
            shouldExpire: true
          });

          newPdfDoc.save();
          res.status(200).send(`File "${originalname}" uploaded successfully to tmpfiles.org. Download URL: ${tmpfileDownloadURL}`);
        }
      }).catch(error => {
        console.error('Error uploading to tmpfiles.org:', error);
        res.status(500).send('Error uploading file to tmpfiles.org');
      });
    }

    if (sessionToken) {
      const tokenExpiry = new Date(Date.now() + 3600000);
      res.cookie('sessionToken', sessionToken, { expires: tokenExpiry });
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

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (foundDocs && foundDocs.length > 0) {
      const s3DownloadUrls = await Promise.all(foundDocs.map(async (doc) => {
        try {
          const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: doc.s3Key,
            Expires: 60 * 60 // URL expires in 1 hour
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



// API endpoint to retrieve the stored PDF file
app.get('/pdf/:filename', auth, async (req, res) => {
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






// API endpoint to extract selected pages and create a new PDF
app.post('/extract-pages', async (req, res) => {
  try {
    const { filename, selectedPages } = req.body;

    // Check if filename and selectedPages are provided and selectedPages is an array
    if (!filename || !selectedPages || !Array.isArray(selectedPages)) {
      return res.status(400).send('Invalid request data');
    }

    // Construct the file path
    const filePath = `uploads/${filename}`;

    // Check if the file exists
    const fileExists = await fs.promises.access(filePath).then(() => true).catch(() => false);

    if (!fileExists) {
      return res.status(404).send('File not found');
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
    const currentDate = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
    const extension = path.extname(filename);
    const extractedFilename = `${path.basename(filename, extension)}_${currentDate}${extension}`;

    // Construct the new file path
    const newFilePath = path.join(__dirname, 'uploads', extractedFilename);

    // Save the new PDF to the file system
    const newPdfBytes = await newPdf.save();
    await fs.promises.writeFile(newFilePath, newPdfBytes);

    // Construct the download link
    const downloadLink = `${req.protocol}://${req.get('host')}/download/${extractedFilename}`;

    res.json({ downloadLink });


  } catch (error) {
    console.error(error);
    res.status(500).send('Error extracting pages');
  }
});


// API endpoint to extract selected pages and create a new PDF for logged in user.

app.post('/login/extract-pages', auth, async (req, res) => {

  try {

    const { filename, selectedPages } = req.body;


    if (!filename || !selectedPages || !Array.isArray(selectedPages)) {

      return res.status(400).send('Invalid request data');

    }


    const filePath = `uploads/${filename}`;

    const fileExists = await fs.promises.access(filePath).then(() => true).catch(() => false);


    if (!fileExists) {

      return res.status(404).send('File not found');

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

    const currentDate = new Date().toISOString().replace(/:/g, '-').slice(0, 19);

    const extractedFilename = `extracted_${currentDate}${extension}`;

    const newFilePath = path.join(__dirname, 'uploads', extractedFilename);


    const newPdfBytes = await newPdf.save();

    await fs.promises.writeFile(newFilePath, newPdfBytes);


    const downloadLink = `${req.protocol}://${req.get('host')}/download/${extractedFilename}`;


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



        console.log('User data saved:', foundUser);

      } else {

        console.log('User not found');

      }

    }


    res.json({ downloadLink });


  } catch (error) {

    console.error(error);

    res.status(500).send('Error extracting pages');

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



// register endpoint
app.post("/register", (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
        username: request.body.username
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          console.error('Error creating user:', error);
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});



// login endpoint
app.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );



          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
            username: user.username,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Error logging out');
    }
    res.clearCookie('connect.sid');
    res.status(200).send('Logout successful');
  });
});


// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// Google OAuth2.0
app.get("/oauth", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'
  }));

app.get('/auth/faulure', (req, res) => {
  res.send('something went wrong..');
})


app.get('/protected', isLoggedIn, (req, res) => {
  res.redirect('http://localhost:3000/');
});


//   Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




module.exports = app;