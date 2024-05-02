import React from 'react';
import { useRouter } from 'next/router';
import "tailwindcss/tailwind.css";
import Head from 'next/head';

const ContactUs = () => {

    const router = useRouter();

  return (
    <><Head>
      <title>
        Contact Us
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
        {/* Contact Form */}
        <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Contact Us</h1>
          <form className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
              <input type="text" id="name" name="name" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105" placeholder="Enter your name" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
              <input type="email" id="email" name="email" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105" placeholder="Enter your email" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea id="message" name="message" rows="4" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105" placeholder="Write your message"></textarea>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="bg-gray-500 hover:bg-gray-800 text-white font-semibold py-2 px-8 rounded-md transition-colors transform hover:scale-110 hover:shadow-xl">
                Submit
              </button>
            </div>
          </form>

        </div>

        {/* Footer Section */}
        <footer className="mt-12">
          <div className="max-w-3xl mx-auto text-sm text-gray-500">
            <p className="mb-1 text-center">JustOurGigs ©</p>
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

export default ContactUs;