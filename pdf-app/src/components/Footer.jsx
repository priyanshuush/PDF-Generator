"use client";
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center mb-4 bg-light-footer text-gray-500">
      <div className="max-w-3xl mx-auto text-sm">
        <p className="mb-2 font-bold text-center">JustOurGigs ©</p>
        <div className="flex space-x-4">
          <Link href="/about" className="cursor-pointer hover:text-gray-700">About Us</Link>
          <Link href="/privacy" className="cursor-pointer hover:text-gray-700">Privacy Policy</Link>
          <Link href="/terms" className="cursor-pointer hover:text-gray-700">Terms of Service</Link>
          <Link href="/contact" className="cursor-pointer hover:text-gray-700">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
