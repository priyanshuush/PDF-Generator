"use client"

import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'; 

export default function CustomNavbar() {
  const [routerMounted, setRouterMounted] = useState(false); 
  const router = useRouter();


  useEffect(() => {
    setRouterMounted(true);
    return () => setRouterMounted(false); 
  }, []);

  const handleNavigation = (href) => {
    router.push(href);
  };

  if (!routerMounted) {
    return null;
  }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleNavigation('/')} // Use handleNavigation with the desired href
                      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      Home
                    </button>
                    <button
                      onClick={() => handleNavigation('/allpdf')} // Use handleNavigation with the desired href
                      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      All PDFs
                    </button>
                    <button
                      onClick={() => handleNavigation('/about')} // Use handleNavigation with the desired href
                      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      About
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Login and Sign Up buttons */}
                <button
                  onClick={() => handleNavigation('/login')} // Use handleNavigation with the desired href for login
                  className="bg-gray-500 rounded-lg shadow-lg hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 text-sm font-medium mr-4"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/signup')} // Use handleNavigation with the desired href for sign up
                  className="bg-gray-500 rounded-lg shadow-lg hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <button
                onClick={() => handleNavigation('/')} // Use handleNavigation with the desired href
                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('/allpdf')} // Use handleNavigation with the desired href
                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium"
              >
                All PDFs
              </button>
              <button
                onClick={() => handleNavigation('/about')} // Use handleNavigation with the desired href
                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium"
              >
                About
              </button>
              <button
                onClick={() => handleNavigation('/login')} // Use handleNavigation with the desired href for login
                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation('/signup')} // Use handleNavigation with the desired href for sign up
                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium"
              >
                Sign Up
              </button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}