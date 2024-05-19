import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "tailwindcss/tailwind.css";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Head from 'next/head';


const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
       const response = await axios.post('http://localhost:8000/register', { 
         email: email,
         password: password,
         username: username,
       });
       console.log(response.data);
       if (response && response.data && response.data.message === "User Created Successfully") {
         setShowAlert(true);
       }
    } catch (error) {
       console.error('Error:', error.response ? error.response.data : error);
    }
   };
   

 useEffect(() => {
    if (showAlert) {
       const timer = setTimeout(() => {
         // Redirect to the login page
         window.location.href = '/login';
       }, 5000);
   
       return () => clearTimeout(timer); // Cleanup on component unmount
    }
   }, [showAlert]);
   const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/google';
 };
   

  return (
    <>
    <ToastContainer />
    <Head>
      <title>
        Sign Up
      </title>
    </Head><div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500">
        {showAlert && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg">
              <p className="text-center text-lg font-bold">User Register Successful</p>
            </div>
          </div>
        )}
        <div className="max-w-md w-full space-y-8 rounded-xl bg-white shadow-md p-8">
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex items-center">
              <label htmlFor="username" className="w-1/3 text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="flex items-center">
              <label htmlFor="email" className="w-1/3 text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="flex items-center">
              <label htmlFor="password" className="w-1/3 text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-md bg-indigo-500 text-white font-medium hover:bg-indigo-700"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full px-4 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-700 flex items-center justify-center"
            >
              <img src="/google-icon.png" alt="Google" className="w-6 h-6 mr-2" />
              SignIn with Google
            </button>
          </form>
        </div>
      </div></>
  );
};

export default Signup;