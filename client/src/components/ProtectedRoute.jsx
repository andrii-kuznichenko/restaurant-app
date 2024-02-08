import React, { useContext, useState } from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import { AuthTableContext } from "../context/AuthTable";
import { DefaultSidebar } from "./DefaultSidebar";
import ScanServeLogo from "../assets/ScanServeLogo.png";
import { Dropdown, Avatar } from "flowbite-react";
import {Sidebar} from 'flowbite-react'

function Protected() {
  const { admin, loading, logout } = useContext(AuthContext);
  const { table, loadingTable } = useContext(AuthTableContext);
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSubMenu = () => {
    setIsSubMenuVisible(!isSubMenuVisible);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {!loading && (
        <>
          {admin ? (
            <>
              {/* Navbar */}

              <nav className="fixed z-40 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-16">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                      <button
                        id="toggleSidebarMobile"
                        onClick={toggleSidebar}
                        aria-expanded="true"
                        aria-controls="sidebar"
                        className="p-2 z-40 text-gray-600 rounded cursor-pointer  hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <svg
                          id="toggleSidebarMobileHamburger"
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <svg
                          id="toggleSidebarMobileClose"
                          className="hidden w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                      <a href="" className="flex ml-2 md:mr-24">
                        <img
                          src={ScanServeLogo}
                          className="h-8 mr-3"
                          alt="Scan&Serve Logo"
                        />
                        <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                          Scan & Serve
                        </span>
                      </a>
                      <form
                        action="#"
                        method="GET"
                        className="hidden lg:block lg:pl-3.5"
                      >
                        <label htmlFor="topbar-search" className="sr-only">
                          Search
                        </label>
                        <div className="relative mt-1 lg:w-96">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            name="email"
                            id="topbar-search"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Search"
                          />
                        </div>
                      </form>
                    </div>
                    <div className="flex gap-4 items-center">
                      {/* <div className="hidden mr-3 -mb-1 sm:block">
                        <a
                          className="github-button"
                          href="https://github.com/themesberg/flowbite-admin-dashboard"
                          data-color-scheme="no-preference: dark; light: light; dark: light;"
                          data-icon="octicon-star"
                          data-size="large"
                          data-show-count="true"
                          aria-label="Star themesberg/flowbite-admin-dashboard on GitHub"
                        >
                          Star
                        </a>
                      </div> */}
                      {/* <!-- Search mobile --> */}
                      <button
                        id="toggleSidebarMobileSearch"
                        type="button"
                        className="p-2 text-gray-500 rounded-lg lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <span className="sr-only">Search</span>
                        {/* <!-- Search icon --> */}
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                      {/* <!-- Notifications --> */}
                      <button
                        type="button"
                        data-dropdown-toggle="notification-dropdown"
                        className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        <span className="sr-only">View notifications</span>
                        {/* <!-- Bell icon --> */}
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                        </svg>
                      </button>
                      {/* <!-- Dropdown menu --> */}
                      <div
                        className="z-10 z-40 hidden max-w-sm my-4 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg dark:divide-gray-600 dark:bg-gray-700"
                        id="notification-dropdown"
                      >
                        <div className="block px-4 py-2 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          Notifications
                        </div>
                        <div>
                          <a
                            href="#"
                            className="flex px-4 py-3 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                          >
                            <div className="flex-shrink-0">
                              <img
                                className="rounded-full w-11 h-11"
                                src="/images/users/bonnie-green.png"
                                alt="Jese image"
                              />
                              <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 border border-white rounded-full bg-primary-700 dark:border-gray-700">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                                  <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                                </svg>
                              </div>
                            </div>
                            <div className="w-full pl-3">
                              <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                                New message from{" "}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  Bonnie Green
                                </span>
                                : "Hey, what's up? All set for the
                                presentation?"
                              </div>
                              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                                a few moments ago
                              </div>
                            </div>
                          </a>
                          <a
                            href="#"
                            className="flex px-4 py-3 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                          >
                            <div className="flex-shrink-0">
                              <img
                                className="rounded-full w-11 h-11"
                                src="/images/users/jese-leos.png"
                                alt="Jese image"
                              />
                              <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-gray-900 border border-white rounded-full dark:border-gray-700">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                                </svg>
                              </div>
                            </div>
                            <div className="w-full pl-3">
                              <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  Jese leos
                                </span>{" "}
                                and{" "}
                                <span className="font-medium text-gray-900 dark:text-white">
                                  5 others
                                </span>{" "}
                                started following you.
                              </div>
                              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                                10 minutes ago
                              </div>
                            </div>
                          </a>
                          <a
                            href="#"
                            className="flex px-4 py-3 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                          >
                            <div className="flex-shrink-0">
                              <img
                                className="rounded-full w-11 h-11"
                                src="/images/users/joseph-mcfall.png"
                                alt="Joseph image"
                              />
                              <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-red-600 border border-white rounded-full dark:border-gray-700">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                            <div className="w-full pl-3">
                              <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  Joseph Mcfall
                                </span>{" "}
                                and{" "}
                                <span className="font-medium text-gray-900 dark:text-white">
                                  141 others
                                </span>{" "}
                                love your story. See it and view more stories.
                              </div>
                              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                                44 minutes ago
                              </div>
                            </div>
                          </a>
                          <a
                            href="#"
                            className="flex px-4 py-3 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                          >
                            <div className="flex-shrink-0">
                              <img
                                className="rounded-full w-11 h-11"
                                src="/images/users/leslie-livingston.png"
                                alt="Leslie image"
                              />
                              <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-green-400 border border-white rounded-full dark:border-gray-700">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                            <div className="w-full pl-3">
                              <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  Leslie Livingston
                                </span>{" "}
                                mentioned you in a comment:{" "}
                                <span className="font-medium text-primary-700 dark:text-primary-500">
                                  @bonnie.green
                                </span>{" "}
                                what do you say?
                              </div>
                              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                                1 hour ago
                              </div>
                            </div>
                          </a>
                          <a
                            href="#"
                            className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <div className="flex-shrink-0">
                              <img
                                className="rounded-full w-11 h-11"
                                src="/images/users/robert-brown.png"
                                alt="Robert image"
                              />
                              <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-purple-500 border border-white rounded-full dark:border-gray-700">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                                </svg>
                              </div>
                            </div>
                            <div className="w-full pl-3">
                              <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  Robert Brown
                                </span>{" "}
                                posted a new video: Glassmorphism - learn how to
                                implement the new design trend.
                              </div>
                              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                                3 hours ago
                              </div>
                            </div>
                          </a>
                        </div>
                        <a
                          href="#"
                          className="block py-2 text-base font-normal text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:underline"
                        >
                          <div className="inline-flex items-center ">
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            View all
                          </div>
                        </a>
                      </div>
                      <div className="hidden md:block">{admin.login}</div>
                      <div className="flex items-center ml-3">
                        <Dropdown
                          label={
                            <Avatar
                              alt="User Icon"
                              img={ScanServeLogo}
                              rounded
                              
                            />
                          }
                          arrowIcon={false}
                          inline
                        >
                          <Dropdown.Header>
                            <span className="block text-sm">{admin.login}</span>
                            <span className="block truncate text-sm font-medium">
                              {admin.email}
                            </span>
                          </Dropdown.Header>
                          <Dropdown.Item><Link to="/">Dashboard</Link></Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={logout}>Log out</Dropdown.Item>
                        </Dropdown>

                        {/* <!-- Dropdown menu --> */}
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
              {/* Navbar */}

              {/* Sidebar */}

              <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-30 h-screen pt-20 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-transform ${
                  isSidebarOpen ? "translate-x-0 md:w-64" : "hidden "
                }  md:translate-x-0`}
                aria-label="Sidebar"
              >
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                  <ul className="space-y-2 font-medium">
                    <li>
                      <a
                        href="#"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                      >
                        <span class="material-symbols-outlined">
                          storefront
                        </span>
                        <span className="ms-3">My Restaurant</span>
                      </a>
                    </li>
                    <li>
                      <Link
                        to="/admin/orders"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                      >
                        <span class="material-symbols-outlined">
                          attach_money
                        </span>
                        <span className="flex-1 ms-3 whitespace-nowrap">
                          Orders
                        </span>
                      </Link>
                    </li>
                    <li className="table-pages" onClick={toggleSubMenu}>
                      <Link
                        to="admin/tables"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                      >
                        <span class="material-symbols-outlined">
                          table_restaurant
                        </span>
                        <span className="flex-1 ms-3 whitespace-nowrap">
                          Tables
                        </span>
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                          />
                        </svg>
                      </Link>
                      <ul
                        id="dropdown-example"
                        className={`${
                          isSubMenuVisible ? "" : "hidden"
                        } py-2 space-y-2`}
                      >
                        <li>
                          <Link
                            to="admin/tables"
                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                          >
                            All tables
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="admin/addtable"
                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                          >
                            Add table
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="admin/menu"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                      >
                        <span class="material-symbols-outlined">
                          restaurant
                        </span>
                        <span className="flex-1 ms-3 whitespace-nowrap">
                          Menu
                        </span>
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                      >
                        <span class="material-symbols-outlined">logout</span>
                        <span
                          className="flex-1 ms-3 whitespace-nowrap"
                          onClick={logout}
                        >
                          Log out
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </aside>

              {/* Sidebar */}

              {/* Dashboard Inhalt */}

              <div className={`mt-16 p-4 transition-margin h-full duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-0"}`}>
                <Outlet />
              </div>

              {/* Dashboard Inhalt */}
            </>
          ) : !loadingTable && table ? (
            <Navigate to="/user" />
          ) : (
            <Navigate to="/login" />
          )}
        </>
      )}
    </>
  );
}

export default Protected;
