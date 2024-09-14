"use client"

import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Cookies from 'js-cookie';
import "tailwindcss/tailwind.css";

import axios from 'axios';

export default function CustomNavbar() {
  

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);


 let username ;
 if (typeof window !== 'undefined') {
    username = Cookies.get('username') || username;
 }

  const handleLogout = () => {

    Cookies.remove('token');
    Cookies.remove('email');
    Cookies.remove('username');

    axios.post('https://pdf-generator-vyog.onrender.com/logout', { username: username })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    setIsAuthenticated(false);

    if (window.location.pathname !== '/') {
      
      window.location.href = '/';
  }
  };
  return (
    <Disclosure as="nav" className="bg-light-footer fixed top-0 w-full z-10 shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-black-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
                    <Link href="/">
                      <button className="text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Home</button>
                    </Link>
                    
                    <Link href="/about">
                      <button className="text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">About</button>
                    </Link>
                    {/* Dropdown Button */}
                    <Menu as="div" className="relative">
                      <Menu.Button className="text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium flex items-center"> {/* Added flex and items-center */}
                        Tools <ChevronDownIcon className="h-4 w-4 ml-1" />
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <Link href={"/extractPDF/extractpages"}>
                                <button
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } flex justify-between w-full px-4 py-2 text-sm`}
                                >
                                  Extract Pages
                                </button>
                              </Link>
                            )}
                          </Menu.Item>
                          {/* <Menu.Item>
                            {({ active }) => (
                              <Link href={"/OCRPDF/OCRPDF"}>
                                <button
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } flex justify-between w-full px-4 py-2 text-sm`}
                                >
                                  OCR PDF
                                </button>
                              </Link>
                            )}
                          </Menu.Item> */}
                          <Menu.Item>
                            {({ active }) => (
                              <Link href={"/translatePDF/translatepdf"}>
                                <button
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } flex justify-between w-full px-4 py-2 text-sm`}
                                >
                                  Translate PDF
                                </button>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link href={"/mergePDF/mergepdf"}>
                                <button
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } flex justify-between w-full px-4 py-2 text-sm`}
                                >
                                  Merge PDFs
                                </button>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link href={"/pdfToWord/pdfToWord"}>
                                <button
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } flex justify-between w-full px-4 py-2 text-sm`}
                                >
                                  PDF To Word
                                </button>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link href={"/imageToPDF/imageToPdf"}>
                                <button
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } flex justify-between w-full px-4 py-2 text-sm`}
                                >
                                  Images To PDF
                                </button>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link href={"/compressPDF/compresspdf"}>
                                <button
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } flex justify-between w-full px-4 py-2 text-sm`}
                                >
                                  Compress PDF
                                </button>
                              </Link>
                            )}
                          </Menu.Item>
                          {/* <Menu.Item>
                            {({ active }) => (
                              <Link href={"/editPDF/editpdf"}>
                                <button
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } flex justify-between w-full px-4 py-2 text-sm`}
                                >
                                  Edit PDF
                                </button>
                              </Link>
                            )}
                          </Menu.Item> */}
                        </div>
                      </Menu.Items>
                    </Menu>
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {isAuthenticated ? (

                  <Menu as="div" className="relative">
                    <Menu.Button className="text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium flex items-center">
                      {username} <ChevronDownIcon className="h-4 w-4 ml-1" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link href={"/allpdf"}>
                              <button
                                className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                  } flex justify-between w-full px-4 py-2 text-sm`}
                              >
                                All PDFs
                              </button>
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (

                            <button
                              onClick={handleLogout}
                              className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } flex justify-between w-full px-4 py-2 text-sm`}
                            >
                              Log Out
                            </button>

                          )}
                        </Menu.Item>

                      </div>
                    </Menu.Items>
                  </Menu>



                ) : (
                  <>
                    <Link href={"/auth/login"}>
                      <button className="bg-gray-500 rounded-lg shadow-lg hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 text-sm font-medium mr-4">Login</button>
                    </Link>
                    <Link href={"/auth/signup"}>
                      <button className="bg-gray-500 rounded-lg shadow-lg hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Sign Up</button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link href="/">
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Home</button>
              </Link>
              <Link href="/allpdf">
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">All PDFs</button>
              </Link>
              <Link href="/about">
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">About</button>
              </Link>
              <Link href="/login">
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Login</button>
              </Link>
              <Link href="/signup">
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Sign Up</button>
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
