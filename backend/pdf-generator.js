// Required Imports
const express = require("express");
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const dbConnect = require("./db/dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/userModel");
const PDF = require("./db/pdfModel");
const auth = require("./auth");
const session = require('express-session');
const passport = require("passport");

require('./Outh')


require('dotenv').config()


console.log(process.env.DB_URL);

// Initializing
const app = express();
const port = 8000;
app.use(session({secret:'cats'}));
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
        <li><code>'/login/extract-pages'</code>: Extract pages for logged-in users. Pass JSON data in the body.</li>
        <li><code>'/register'</code>: Register a new user. Pass email and password in the body.</li>
        <li><code>'/login'</code>: Login with registered email and password. Pass email and password in the body.</li>
        <li><code>'/auth-endpoint'</code>: Requires authentication to access.</li>
      </ul>
      <h2>JSON format for 'extract-pages' and 'login/extract-pages':</h2>
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


// app.get('/allpdfs', auth, async (req, res) => {
//   try {
//     if (req.user) {
//       const foundUser = await User.findOne({ email: req.user.userEmail });

//       if (foundUser) {
//         const downloadUrls = foundUser.downloadUrls || [];
//         res.json(downloadUrls);
//       } else {
//         console.log('User not found');
//         res.status(404).send('User not found');
//       }
//     } else {
//       res.status(401).send('Unauthorized');
//     }
//   }
//   catch(error) {
//     console.error(error);
//     res.status(500).send('Error retrieving files');
//   }
// })

app.get('/allpdfs', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const foundUser = await User.findOne({ email: req.user.userEmail });

    if (foundUser) {
      const downloadUrls = foundUser.downloadUrls || [];

      // Fetch paginated data from MongoDB
      const paginatedUrls = await User.aggregate([
        { $match: { email: req.user.userEmail } },
        { $project: { downloadUrls: { $slice: ["$downloadUrls", skip, limit] } } }
      ]);

      // Extract the downloadUrls array from the result
      const resultUrls = paginatedUrls.length > 0 ? paginatedUrls[0].downloadUrls : [];

      res.json(resultUrls);
    } else {
      console.log('User not found');
      res.status(404).send('User not found');
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


// API endpoint to delete a stored PDF file
app.delete('/pdf/:filename', auth, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`;

    // Check if the file exists
    const fileExists = await fs.promises.access(filePath).then(() => true).catch(() => false);
    if (!fileExists) {
      return res.status(404).send('File not found');
    }

    // Delete the file
    await fs.promises.unlink(filePath);

    // Find the user and remove the matching download URL from the array
    const foundUser = await User.findOne({ 
      email: req.user.userEmail,
      downloadUrls: { $elemMatch: { $regex: filename, $options: 'i' } }
    });

    if (foundUser) {
      // Get the index of the matching download URL
      const index = foundUser.downloadUrls.findIndex(url => url.includes(filename));

      if (index !== -1) {
        // Remove the matching download URL from the array
        foundUser.downloadUrls.splice(index, 1);
        await foundUser.save();
      }
    } else {
      console.log('User not found');
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

        foundUser.downloadUrls.push(downloadLink);

        await foundUser.save();

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
    const filePath = path.join(__dirname, 'uploads', filename);

    const fileExists = await fs.promises.access(filePath).then(() => true).catch(() => false);
    if (!fileExists) {
      return res.status(404).send('File not found');
    }

    res.download(filePath); // Provide the file for download
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving file for download');
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
          if(!passwordCheck) {
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


// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

function isLoggedIn(req,res,next){
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
passport.authenticate('google',{
  successRedirect:'/protected',
  failureRedirect:'/auth/failure'
}));

app.get('/auth/faulure', (req,res)=>{
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