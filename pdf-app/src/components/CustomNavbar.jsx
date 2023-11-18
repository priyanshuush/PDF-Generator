"use client";

// Import necessary components from libraries
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'


// Navigation items
const navigation = [
  { name: 'Home', href: '#', current: true },
  { name: 'All PDFs', href: '#', current: false },
]

// Utility function to conditionally apply classes
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CustomNavbar() {
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
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="data:image/jpeg;base64,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"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
