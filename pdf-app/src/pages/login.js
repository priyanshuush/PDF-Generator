"use client";

import "tailwindcss/tailwind.css";
import { useRouter } from 'next/router';

import React, { useState } from 'react';
import axios from 'axios';

import Head from "next/head";



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const api = axios.create({
    baseURL: 'http://localhost:8000'
  });


  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      const response = await api.post('/login', { 
        email: username,
        password: password
      });

    if (response.data.message === "Login Successful") {
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);

      console.log("JWT token:", response.data.token);
      console.log("username:", response.data.username);

      router.push('/about');
    } else if(response.data.message === "Passwords does not match") {
      
      alert("Wrong ID or password");
    }
     
      
    } catch (error) {
      console.error('Error:', error.response.data); 
      alert("Wrong ID or password");
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/google';
 };

  return (
    <><Head>
      <title>
        Login
      </title>
    </Head><div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500">
        <div className="max-w-md w-full space-y-8 rounded-xl bg-white shadow-md p-8">
          <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex items-center">
              <label htmlFor="username" className="w-1/3 text-sm font-medium">
                Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              Login
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full px-4 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-700 flex items-center justify-center"
            >
              <img src="/google-icon.png" alt="Google" className="w-6 h-6 mr-2" />
              Login with Google
            </button>
          </form>
        </div>
      </div></>
  );
};

export default Login;
