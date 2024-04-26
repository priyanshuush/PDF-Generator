"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'; 

const Footer = () => {
    const [routerMounted, setRouterMounted] = useState(false); // State to track whether router is mounted
    const router = useRouter();
  
    // useEffect hook to set routerMounted state when router is mounted
    useEffect(() => {
      setRouterMounted(true);
      return () => setRouterMounted(false); // Cleanup function to reset state when component unmounts
    }, []);

    const handleNavigation = (href) => {
        router.push(href);
      };

  return (

    <footer className="mt-2 text-white flex flex-col items-center justify-center mb-4">

      <div className="max-w-3xl mx-auto text-sm flex flex-col items-center">

        <p className="mb-1">Created with ❤️ by Utkarsh Gauniyal and Priyanshu Gupta</p>

        <div className="flex space-x-4">

          <a href="#" className="hover:text-gray-700">About Us</a>

          <a href="#" className="hover:text-gray-700">Privacy Policy</a>

          <a href="#" className="hover:text-gray-700">Terms of Service</a>
        
          <a onClick={() => handleNavigation('/contact')} className="hover:text-gray-700">Contact Us</a>

        </div>

      </div>

    </footer>

  );

};


export default Footer;