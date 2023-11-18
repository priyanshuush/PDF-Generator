
# PDF-Generator (Backend - ExpressJS)

This Express application serves as a PDF Generator API providing endpoints for uploading, retrieving, and extracting PDF files. It uses the pdf-lib library for PDF manipulation and multer for file uploading functionality.

## API Reference

#### Get pdf

```http
  GET /pdf/:filename
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `filename` | `string` | **Required**. Your pdf filename |

#### Upload pdf

```http
  POST /upload
```

| Form Data | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `file`      | `application/pdf` | **Required**. pdf file |


```http
  POST /extract-pages
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `{            | `json` | **Required**. filename, selectedPages |
  **"filename"**: "sample.pdf",
  **"selectedPages"**: [1, 3, 7],
  **"newFilename":** "custom_extracted_file.pdf"
}`       |

## Installation

Install pdf-generator with git:

```bash
  git clone https://github.com/ugauniyal/PDF-Generator.git
  cd PDF-Generator/backend
```

Run pdf-generator.:

```bash
  node pdf-generator.js
```

<br>

## Screenshots

### Upload PDF
![Upload PDF Screenshot](https://cdn.discordapp.com/attachments/438420692007125031/1175222466512171018/image.png?ex=656a7236&is=6557fd36&hm=c1e559d17461f787df0e9146e671ccaf2426393d2eeb2053c380566e9cd673a8&)

<br>

### Retrieve PDF
![Retrieve PDF Screenshot](https://cdn.discordapp.com/attachments/438420692007125031/1175222767029850113/image.png?ex=656a727e&is=6557fd7e&hm=9a64bf626ba42e83dbb1b05a3e4135a0af6b8e951bfae829d8bca7dba3706c4a&)

<br>

### Extract pages of PDF
![Extract pages of PDF Screenshot](https://cdn.discordapp.com/attachments/438420692007125031/1175224039896256544/image.png?ex=656a73ad&is=6557fead&hm=b33949f47d9a70c0ec72659b54f677f50e3d2a924bc9bc1814629bf45e26178f&)

<br>


## Running Tests

To run tests, run the following command. I used supertest to create the tests and jest for running the tests.

```bash
  npm test
```

<br>
<br>
<br>
<br>
<br>
<br>

# PDF-Generator (Frontend - NextJS)
This NextJS application serves as a PDF Generator which lets the user to upload the pdf using a dropzone and then the user can preview the pages of the pdf that they uploaded. The user can also select the pages that they want to extract and then click on generate PDF to get a download link for the new pdf with extracted pages.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<br>

## Installation

Install pdf-generator with git:

```bash
  git clone https://github.com/ugauniyal/PDF-Generator.git
  cd PDF-Generator/pdf-app
```

<br>


## Running Tests

To run tests, run the following command. I used enzyme to create the tests and jest for running the tests.

```bash
  npm test
```

## Deployment

https://pdf-generator-three-kappa.vercel.app/

