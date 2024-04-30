"use client"
import React from 'react';
import Link from 'next/link';


const Footer = () => {

  return (

    <footer className="mt-2 text-white flex flex-col items-center justify-center mb-4">

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

  );

};


export default Footer;