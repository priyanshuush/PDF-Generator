const request = require('supertest');
const app = require('../pdf-generator');


describe('PDF Generator API Tests', () => {

  // Test for uploading a PDF file
  it('should upload a PDF file', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('pdf', './uploads/sample.pdf');

    // Assertions for successful upload
    expect(res.status).toBe(200);
    expect(res.text).toContain('uploaded successfully');
  }, 10000); // Set a timeout of 10 seconds (10000 milliseconds)




  // Test for retrieving a stored PDF file
  it('should retrieve the stored PDF file', async () => {
    const res = await request(app).get('/pdf/sample.pdf');

    // Assertions for successful retrieval
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('application/pdf; charset=utf-8');
  });



  // Test for extracting selected pages and creating a new PDF
  it('should extract selected pages and create a new PDF', async () => {

    const requestBody = {
      filename: 'sample.pdf',
      selectedPages: [1],
      newFilename: 'extracted_sample.pdf'
    };

    const res = await request(app)
      .post('/extract-pages')
      .send(requestBody);

    // Assertions for successful extraction
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('application/pdf; charset=utf-8');
  });
});
