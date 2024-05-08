"use client"
import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 const [isAuthenticated, setIsAuthenticated] = useState(false);

 // Simulate checking for a JWT token
 useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsAuthenticated(true);
    }
 }, []);

 return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
 );
};

