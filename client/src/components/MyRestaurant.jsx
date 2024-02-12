import axios from "../axiosInstance";
import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/Auth";
import DefaultLogo from "../assets/Default-Logo.png";

const MyRestaurant = () => {
  const { admin, loading } = useContext(AuthContext);
  const [restaurant, setRestaurant] = useState({});
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [formValues, setFormValues] = useState({
    title: "",
    information: "",
    openTime: {
      Monday: "00:00",
      Tuesday: "00:00",
      Wednesday: "00:00",
      Thursday: "00:00",
      Friday: "00:00",
      Saturday: "00:00",
      Sunday: "00:00",
    },
    closeTime: {
      Monday: "00:00",
      Tuesday: "00:00",
      Wednesday: "00:00",
      Thursday: "00:00",
      Friday: "00:00",
      Saturday: "00:00",
      Sunday: "00:00",
    },
    socials: {
      facebook: "",
      instagram: "",
      tiktok: "",
    },
    currency: "",
  });

  useEffect(() => {
    axios
      .get(`/dashboard/restaurant/${admin.restaurantId}`)
      .then((res) => {
        console.log("Received restaurant data:", res.data);
        setRestaurant(res.data);
        setFormValues({
          title: res.data.title,
          information: res.data.information,
          openTime: {
            Monday: res.data.openTime?.Monday || "00:00",
            Tuesday: res.data.openTime?.Tuesday || "00:00",
            Wednesday: res.data.openTime?.Wednesday || "00:00",
            Thursday: res.data.openTime?.Thursday || "00:00",
            Friday: res.data.openTime?.Friday || "00:00",
            Saturday: res.data.openTime?.Saturday || "00:00",
            Sunday: res.data.openTime?.Sunday || "00:00",
          },
          closeTime: {
            Monday: res.data.closeTime?.Monday || "00:00",
            Tuesday: res.data.closeTime?.Tuesday || "00:00",
            Wednesday: res.data.closeTime?.Wednesday || "00:00",
            Thursday: res.data.closeTime?.Thursday || "00:00",
            Friday: res.data.closeTime?.Friday || "00:00",
            Saturday: res.data.closeTime?.Saturday || "00:00",
            Sunday: res.data.closeTime?.Sunday || "00:00",
          },
          socials: {
            facebook: res.data.socials?.facebook || '',
            instagram: res.data.socials?.instagram || '',
            tiktok: res.data.socials?.tiktok || '',
          },
          currency: res.data.currency,
        });
      })
      .catch((e) => console.error("Error fetching restaurant data:", e));
  }, [updateTrigger]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      axios
        .put(`/dashboard/restaurant/logo/${admin.restaurantId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Logo uploaded successfully:", response.data);
          setUpdateTrigger((prev) => prev + 1);
        })
        .catch((error) => {
          console.error("Error uploading logo:", error);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length === 1) {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (keys.length === 2) {
      setFormValues((prevState) => ({
        ...prevState,
        [keys[0]]: {
          ...prevState[keys[0]],
          [keys[1]]: value,
        },
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/dashboard/restaurant/info/${admin.restaurantId}`, formValues)
      .then((response) => {
        console.log("Restaurant updated successfully:", response.data);
        setUpdateTrigger((prev) => prev + 1);
      })
      .catch((error) => {
        console.error("Error updating restaurant:", error);
      });
  };

  const countSocials = (socials) => {
    return Object.values(socials || {}).filter((value) => value).length;
  };

  const socialCount = countSocials(restaurant.socials);
  const buttonText = socialCount < 3 ? "Add Social" : "Edit Socials";

  return (
    <>
      <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
        {/* <div className="mb-4 col-span-full xl:mb-2">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
            My Restaurant
          </h1>
        </div> */}
        {/* <!-- Right Content --> */}
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
              <img
                className={`mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 ${
                  restaurant.logo &&
                  restaurant.logo !==
                    "https://res.cloudinary.com/ddoeaay7c/image/upload/v1707763851/Default-Logo_ylhopo.png"
                    ? ""
                    : "blur-sm"
                }`}
                src={
                  restaurant.logo &&
                  restaurant.logo !==
                    "https://res.cloudinary.com/ddoeaay7c/image/upload/v1707763851/Default-Logo_ylhopo.png"
                    ? restaurant.logo
                    : DefaultLogo
                }
                alt={`Restaurant Logo ${restaurant.title}`}
              />
              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                  {restaurant.title}
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {admin.email}
                </div>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {admin.role}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                    className="inline-flex bg-footerBackground items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <svg
                      className="w-4 h-4 mr-2 -ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                      <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
                    </svg>
                    Upload new logo
                  </button>
                  {/* <button
                    type="button"
                    className="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Delete
                  </button> */}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Language & Time
            </h3>
            <div className="mb-4">
              <label
                htmlFor="settings-language"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select language
              </label>
              <select
                id="settings-language"
                name="countries"
                className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option>English (US)</option>
                <option>Italiano</option>
                <option>Français (France)</option>
                <option>正體字</option>
                <option>Español (España)</option>
                <option>Deutsch</option>
                <option>Português (Brasil)</option>
              </select>
            </div>
            <div className="mb-6">
              <label
                htmlFor="settings-timezone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Time Zone
              </label>
              <select
                id="settings-timezone"
                name="countries"
                className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option>GMT+0 Greenwich Mean Time (GMT)</option>
                <option>GMT+1 Central European Time (CET)</option>
                <option>GMT+2 Eastern European Time (EET)</option>
                <option>GMT+3 Moscow Time (MSK)</option>
                <option>GMT+5 Pakistan Standard Time (PKT)</option>
                <option>GMT+8 China Standard Time (CST)</option>
                <option>GMT+10 Eastern Australia Standard Time (AEST)</option>
              </select>
            </div>
            <div>
              <button className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Save all
              </button>
            </div>
          </div> */}
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="flow-root">
              <h3 className="text-xl font-semibold dark:text-white">
                Social accounts
              </h3>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {restaurant.socials && (
                  <>
                    {restaurant.socials.facebook && (
                      <li className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <svg
                              className="w-5 h-5 dark:text-white"
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fab"
                              data-icon="facebook-f"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 320 512"
                            >
                              <path
                                fill="currentColor"
                                d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                              ></path>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-base font-semibold text-gray-900 truncate dark:text-white">
                              Facebook account
                            </span>
                            <a
                              href="#"
                              className="block text-sm font-normal truncate text-primary-700 hover:underline dark:text-primary-500"
                            >
                              {restaurant.socials.facebook}
                            </a>
                          </div>
                          <div className="inline-flex items-center">
                            <a
                              href="#"
                              className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            >
                              Disconnect
                            </a>
                          </div>
                        </div>
                      </li>
                    )}
                    {restaurant.socials.instagram && (
                      <li className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <svg
                              className="w-5 h-5 dark:text-white"
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fab"
                              data-icon="facebook-f"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 320 512"
                            >
                              <path
                                fill="currentColor"
                                d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9s-58-34.5-93.9-36.2c-37.2-1.7-148.9-1.7-186.1 0-35.9 1.7-67.7 9.9-93.9 36.2s-34.5 58-36.2 93.9c-1.7 37.2-1.7 148.9 0 186.1 1.7 35.9 9.9 67.7 36.2 93.9s58 34.5 93.9 36.2c37.2 1.7 148.9 1.7 186.1 0 35.9-1.7 67.7-9.9 93.9-36.2s34.5-58 36.2-93.9c1.7-37.2 1.7-148.8 0-186zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.8-99.5 9-132.1 9s-102.7 2.8-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.8-29.5-9-99.5-9-132.1s-2.8-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.8 99.5-9 132.1-9s102.7-2.8 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.8 29.5 9 99.5 9 132.1s2.8 102.7-9 132.1zM319.6 255.9c0-52.9-43-95.9-95.9-95.9s-95.9 43-95.9 95.9 43 95.9 95.9 95.9 95.9-43 95.9-95.9z"
                              ></path>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-base font-semibold text-gray-900 truncate dark:text-white">
                              Instagram account
                            </span>
                            <a
                              href="#"
                              className="block text-sm font-normal truncate text-primary-700 hover:underline dark:text-primary-500"
                            >
                              {restaurant.socials.instagram}
                            </a>
                          </div>
                          <div className="inline-flex items-center">
                            <a
                              href="#"
                              className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            >
                              Disconnect
                            </a>
                          </div>
                        </div>
                      </li>
                    )}
                    {restaurant.socials.tiktok && (
                      <li className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <svg
                              className="w-5 h-5 dark:text-white"
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fab"
                              data-icon="facebook-f"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 320 512"
                            >
                              <path
                                fill="currentColor"
                                d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25v178a162.55,162.55,0,0,1-31.89,88.18A160,160,0,0,1,33.83,467.6C19.09,454,0,428.42,0,399.45c0-47.93,38.66-86.86,86.86-86.86,24,0,38.66,10.34,55.43,21.94V171.69c0-23.69,28.62-35.62,45.38-19.09,10.35,10.34,23.69,24,31.88,31.89,17.73-17.73,35.46-41.54,47.92-71.55h40.6c-12.89,40.6-32.83,72.5-55.43,97.2,20.77,13.59,44.43,22.93,71.54,23.69v39.25Z"
                              ></path>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-base font-semibold text-gray-900 truncate dark:text-white">
                              TikTok account
                            </span>
                            <a
                              href="#"
                              className="block text-sm font-normal truncate text-primary-700 hover:underline dark:text-primary-500"
                            >
                              {restaurant.socials.tiktok}
                            </a>
                          </div>
                          <div className="inline-flex items-center">
                            <a
                              href="#"
                              className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            >
                              Disconnect
                            </a>
                          </div>
                        </div>
                      </li>
                    )}
                  </>
                )}

                {/* Hard-coded */}
                <li className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 dark:text-white"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="facebook-f"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                      >
                        <path
                          fill="currentColor"
                          d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-base font-semibold text-gray-900 truncate dark:text-white">
                        Facebook account
                      </span>
                      <a
                        href="#"
                        className="block text-sm font-normal truncate text-primary-700 hover:underline dark:text-primary-500"
                      >
                        www.facebook.com/themesberg
                      </a>
                    </div>
                    <div className="inline-flex items-center">
                      <a
                        href="#"
                        className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        Disconnect
                      </a>
                    </div>
                  </div>
                </li>
                {/* Hard-coded */}
              </ul>
              <div>
                {socialCount === 0 ? (
                  <button className="text-white bg-footerBackground bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    {buttonText}
                  </button>
                ) : (
                  <button className="text-black border border-gray-200 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    {buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              General information
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-6">
                  <label
                    htmlFor="restaurant-name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Restaurant name
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="restaurant-name"
                    value={formValues.title}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.title}
                    onChange={handleInputChange}
                    
                  />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <label
                    htmlFor="restaurant-information"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Restaurant information
                  </label>
                  <textarea
                    type="text"
                    name="information"
                    id="restaurant-information"
                    onChange={handleInputChange}
                    value={formValues.information}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.information}
                   
                  />
                </div>
                {/* <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Green"
                    required
                  />
                </div> */}

                <div className="col-span-4 sm:col-span-2 flex items-center">
                  <div className="mt-4 dark:text-white">Monday</div>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="country"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Opening time
                  </label>
                  <input
                    type="text"
                    name="openTime.Monday"
                    id="country"
                    onChange={handleInputChange}
                    value={formValues.openTime.Monday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.openTime?.Monday ?? "00:00"}
                    
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="city"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Closing time
                  </label>
                  <input
                    type="text"
                    name="closeTime.Monday"
                    id="city"
                    onChange={handleInputChange}
                    value={formValues.closeTime.Monday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.closeTime?.Monday ?? "00:00"}
                    
                  />
                </div>

                <div className="col-span-4 sm:col-span-2 flex items-center">
                  <div className="dark:text-white">Tuesday</div>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="text"
                    name="openTime.Tuesday"
                    id="country"
                    onChange={handleInputChange}
                    value={formValues.openTime.Tuesday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.openTime?.Tuesday ?? "00:00"}
                    
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="text"
                    name="closeTime.Tuesday"
                    id="city"
                    onChange={handleInputChange}
                    value={formValues.closeTime.Tuesday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.closeTime?.Tuesday ?? "00:00"}
                    
                  />
                </div>

                <div className="col-span-4 sm:col-span-2 flex items-center">
                  <div className="dark:text-white">Wednesday</div>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="text"
                    name="openTime.Wednesday"
                    id="country"
                    onChange={handleInputChange}
                    value={formValues.openTime.Wednesday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.openTime?.Wednesday ?? "00:00"}
                    
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="text"
                    name="closeTime.Wednesday"
                    id="city"
                    onChange={handleInputChange}
                    value={formValues.closeTime.Wednesday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.closeTime?.Wednesday ?? "00:00"}
                    
                  />
                </div>

                <div className="col-span-4 sm:col-span-2 flex items-center">
                  <div className="dark:text-white">Thursday</div>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="text"
                    name="openTime.Thursday"
                    id="country"
                    onChange={handleInputChange}
                    value={formValues.openTime.Thursday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.openTime?.Thursday ?? "00:00"}
                    
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="text"
                    name="closeTime.Thursday"
                    id="city"
                    onChange={handleInputChange}
                    value={formValues.closeTime.Thursday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.closeTime?.Thursday ?? "00:00"}
                    required
                  />
                </div>

                <div className="col-span-4 sm:col-span-2 flex items-center">
                  <div className="dark:text-white">Friday</div>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="text"
                    name="openTime.Friday"
                    id="country"
                    onChange={handleInputChange}
                    value={formValues.openTime.Friday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.openTime?.Friday ?? "00:00"}
                    required
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="text"
                    name="closeTime.Friday"
                    id="city"
                    onChange={handleInputChange}
                    value={formValues.closeTime.Friday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.closeTime?.Friday ?? "00:00"}
                    required
                  />
                </div>

                <div className="col-span-4 sm:col-span-2 flex items-center">
                  <div className="dark:text-white">Saturday</div>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="text"
                    name="openTime.Saturday"
                    id="country"
                    onChange={handleInputChange}
                    value={formValues.openTime.Saturday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.openTime?.Saturday ?? "00:00"}
                    required
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="text"
                    name="closeTime.Saturday"
                    id="city"
                    onChange={handleInputChange}
                    value={formValues.closeTime.Saturday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.closeTime?.Saturday ?? "00:00"}
                    required
                  />
                </div>

                <div className="col-span-4 sm:col-span-2 flex items-center">
                  <div className="dark:text-white">Sunday</div>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="text"
                    name="openTime.Sunday"
                    id="country"
                    onChange={handleInputChange}
                    value={formValues.openTime.Sunday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.openTime?.Sunday ?? "00:00"}
                    required
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="text"
                    name="closeTime.Sunday"
                    id="city"
                    onChange={handleInputChange}
                    value={formValues.closeTime.Sunday}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.closeTime?.Sunday ?? "00:00"}
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-6">
                  <label
                    htmlFor="currency"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={formValues.currency}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value={restaurant.currency}>
                      {restaurant.currency}
                    </option>
                    <option value="USD">USD</option>
                  </select>
                  {/* <input
                    type="text"
                    name="weekends"
                    id="weekends"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={restaurant.currency}
                    required
                  /> */}
                </div>

                <div className="col-span-6 sm:col-full">
                  <button
                    className="text-white bg-footerBackground bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    type="submit"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Password information
            </h3>
            <form action="#">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="current-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Current password
                  </label>
                  <input
                    type="text"
                    name="current-password"
                    id="current-password"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    New password
                  </label>
                  <input
                    data-popover-target="popover-password"
                    data-popover-placement="bottom"
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                    required
                  />
                  <div
                    data-popover
                    id="popover-password"
                    role="tooltip"
                    className="absolute z-10 invisible inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                  >
                    <div className="p-3 space-y-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Must have at least 6 characters
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="h-1 bg-orange-300 dark:bg-orange-400"></div>
                        <div className="h-1 bg-orange-300 dark:bg-orange-400"></div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-600"></div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-600"></div>
                      </div>
                      <p>It’s better to have:</p>
                      <ul>
                        <li className="flex items-center mb-1">
                          <svg
                            className="w-4 h-4 mr-2 text-green-400 dark:text-green-500"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Upper & lower case letters
                        </li>
                        <li className="flex items-center mb-1">
                          <svg
                            className="w-4 h-4 mr-2 text-gray-300 dark:text-gray-400"
                            aria-hidden="true"
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
                          A symbol (#$&)
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-gray-300 dark:text-gray-400"
                            aria-hidden="true"
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
                          A longer password (min. 12 chars.)
                        </li>
                      </ul>
                    </div>
                    <div data-popper-arrow></div>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="text"
                    name="confirm-password"
                    id="confirm-password"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-full">
                  <button
                    className="text-white bg-footerBackground bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    type="submit"
                  >
                    Save all
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="flow-root">
              <h3 className="text-xl font-semibold dark:text-white">
                Sessions
              </h3>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                <li className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 dark:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-900 truncate dark:text-white">
                        California 123.123.123.123
                      </p>
                      <p className="text-sm font-normal text-gray-500 truncate dark:text-gray-400">
                        Chrome on macOS
                      </p>
                    </div>
                    <div className="inline-flex items-center">
                      <a
                        href="#"
                        className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        Revoke
                      </a>
                    </div>
                  </div>
                </li>
                <li className="pt-4 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 dark:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-900 truncate dark:text-white">
                        Rome 24.456.355.98
                      </p>
                      <p className="text-sm font-normal text-gray-500 truncate dark:text-gray-400">
                        Safari on iPhone
                      </p>
                    </div>
                    <div className="inline-flex items-center">
                      <a
                        href="#"
                        className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        Revoke
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
              <div>
                <button className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  See more
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <div className="grid grid-cols-1 px-4 xl:grid-cols-1 xl:gap-4">
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0">
          <div className="flow-root">
            <h3 className="text-xl font-semibold dark:text-white">
              Alerts & Notifications
            </h3>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              You can set up Themesberg to get notifications
            </p>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* <!-- Item 1 --> */}
              <div className="flex items-center justify-between py-4">
                <div className="flex flex-col flex-grow">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Company News
                  </div>
                  <div className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Get Themesberg news, announcements, and product updates
                  </div>
                </div>
                <label
                  htmlFor="company-news"
                  className="relative flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="company-news"
                    className="sr-only"
                  />
                  <span className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"></span>
                </label>
              </div>
              {/* <!-- Item 2 --> */}
              <div className="flex items-center justify-between py-4">
                <div className="flex flex-col flex-grow">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Account Activity
                  </div>
                  <div className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Get important notifications about you or activity you've
                    missed
                  </div>
                </div>
                <label
                  htmlFor="account-activity"
                  className="relative flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="account-activity"
                    className="sr-only"
                    checked
                  />
                  <span className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"></span>
                </label>
              </div>
              {/* <!-- Item 3 --> */}
              <div className="flex items-center justify-between py-4">
                <div className="flex flex-col flex-grow">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Meetups Near You
                  </div>
                  <div className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Get an email when a Dribbble Meetup is posted close to my
                    location
                  </div>
                </div>
                <label
                  htmlFor="meetups"
                  className="relative flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="meetups"
                    className="sr-only"
                    checked
                  />
                  <span className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"></span>
                </label>
              </div>
              {/* <!-- Item 4 --> */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex flex-col flex-grow">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    New Messages
                  </div>
                  <div className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Get Themsberg news, announcements, and product updates
                  </div>
                </div>
                <label
                  htmlFor="new-messages"
                  className="relative flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="new-messages"
                    className="sr-only"
                  />
                  <span className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"></span>
                </label>
              </div>
            </div>
            <div className="mt-6">
              <button className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Save all
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0">
          <div className="flow-root">
            <h3 className="text-xl font-semibold dark:text-white">
              Email Notifications
            </h3>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              You can set up Themesberg to get email notifications{" "}
            </p>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* <!-- Item 1 --> */}
              <div className="flex items-center justify-between py-4">
                <div className="flex flex-col flex-grow">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Rating reminders
                  </div>
                  <div className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Send an email reminding me to rate an item a week after
                    purchase
                  </div>
                </div>
                <label
                  htmlFor="rating-reminders"
                  className="relative flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="rating-reminders"
                    className="sr-only"
                  />
                  <span className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"></span>
                </label>
              </div>
              {/* <!-- Item 2 --> */}
              <div className="flex items-center justify-between py-4">
                <div className="flex flex-col flex-grow">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Item update notifications
                  </div>
                  <div className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Send user and product notifications htmlFor you
                  </div>
                </div>
                <label
                  htmlFor="item-update"
                  className="relative flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="item-update"
                    className="sr-only"
                    checked
                  />
                  <span className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"></span>
                </label>
              </div>
              {/* <!-- Item 3 --> */}
              <div className="flex items-center justify-between py-4">
                <div className="flex flex-col flex-grow">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Item comment notifications
                  </div>
                  <div className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Send me an email when someone comments on one of my items
                  </div>
                </div>
                <label
                  htmlFor="item-comment"
                  className="relative flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="item-comment"
                    className="sr-only"
                    checked
                  />
                  <span className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"></span>
                </label>
              </div>
              {/* <!-- Item 4 --> */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex flex-col flex-grow">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Buyer review notifications
                  </div>
                  <div className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Send me an email when someone leaves a review with their
                    rating
                  </div>
                </div>
                <label
                  htmlFor="buyer-rev"
                  className="relative flex items-center cursor-pointer"
                >
                  <input type="checkbox" id="buyer-rev" className="sr-only" />
                  <span className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"></span>
                </label>
              </div>
            </div>
            <div className="mt-6">
              <button className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Save all
              </button>
            </div>
          </div>
        </div>
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    </>
  );
};

export default MyRestaurant;
