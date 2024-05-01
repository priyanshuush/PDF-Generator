import React from 'react';
import "tailwindcss/tailwind.css";
import Head from 'next/head';
import Link from 'next/link';

const About = () => {


  return (
    <>
    <Head>
      <title>
        About
      </title>
    </Head>
    
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-8">
        {/* Navigation Button */}
        <Link href="/">
          <button
            className="absolute top-4 right-4 bg-gray-500 hover:bg-blue-900 text-white py-2 px-4 rounded-md transition-colors duration-300"
          >
          
            Go to PDF Editor
          </button>
        </Link>

        {/* Welcome Section */}
        <div className="text-center mt-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to PDF Generator!</h1>
          <p className="text-lg text-gray-600">Revolutionize your document management experience with our innovative PDF extraction tool.</p>
        </div>

        {/* Features Section */}
        <div className="max-w-3xl space-y-12 mt-12 prose text-gray-700">
          {/* Feature 1 */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="font-bold text-gray-600 text-2xl mb-4">Empowering Users with Streamlined PDF Extraction</h3>
            <p className="text-lg">
              This application is designed to revolutionize your document management experience. We understand the frustration of working with large PDFs and the need to extract specific pages for further use. That's where our innovative PDF Generator comes in!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="font-bold text-gray-600 text-2xl mb-4">Effortless Upload and Preview</h3>
            <p className="text-lg">
              Our user-friendly interface features a drag-and-drop zone that makes uploading your PDF files a breeze. Forget cumbersome navigation or file selection methods. Simply drag your PDF onto the designated area, and we'll handle the rest. Once uploaded, a clear preview of your document pages will be displayed for easy reference.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="font-bold text-gray-600 text-2xl mb-4">Precise Page Selection</h3>
            <p className="text-lg">
              Gone are the days of manually extracting pages through tedious editing software. Our intuitive interface empowers you to meticulously select the exact pages you require. With a few simple clicks, you can choose the specific pages you need for further processing or sharing.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="font-bold text-gray-600 text-2xl mb-4">Effortless Extraction, Instant Download</h3>
            <p className="text-lg">
              Once you've selected the desired pages, our powerful PDF Generator takes over. With a single click, a new PDF containing only the chosen pages is generated. We then provide you with a convenient download link, allowing you to instantly access and utilize the extracted content.
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="mt-auto py-8">
          <div className="max-w-3xl mx-auto text-sm text-gray-500">
            <p className="mb-2 font-bold text-center">JustOurGigs ©</p>
            <div className="flex space-x-4">
              <Link href={"/about"} className="cursor-pointer hover:text-gray-700">About Us</Link>
              <Link href={"/about"} className="cursor-pointer hover:text-gray-700">Privacy Policy</Link>
              <Link href={"/about"} className="cursor-pointer hover:text-gray-700">Terms of Service</Link>
              <Link href={"/contact"} className="cursor-pointer hover:text-gray-700">Contact Us</Link>
            </div>
          </div>
        </footer>
      </div></>
  );
};

export default About;
