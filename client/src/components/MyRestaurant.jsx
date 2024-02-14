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
         
        </div>
      </div>
      <div className="grid grid-cols-1 px-4 xl:grid-cols-1 xl:gap-4">
        
        
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
