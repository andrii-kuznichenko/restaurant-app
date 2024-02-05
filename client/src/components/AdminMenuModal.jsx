import React from "react";
import AdminEditDeleteMeal from "./AdminUpdateMeal";

function AdminMenuModal({ item, isOpen, closeModal }) {
    console.log(item);
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75 backdrop-blur-md"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="flex flex-col h-full">
            <div className="relative w-full flex-grow-0 flex-shrink-0 h-60">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={closeModal}
                className="absolute top-0 right-0 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-full p-2 m-2 border border-gray-400 w-8 h-8 flex items-center justify-center transition-transform duration-200 ease-in-out transform hover:scale-110"
              >
                X
              </button>
            </div>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex-grow">
              <div className="flex justify-between items-center">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {item.title}
                </h3>
                <p className="text-lg leading-6 font-medium text-gray-900">
                  €{item.price}
                </p>
              </div>
              <p className="text-sm text-gray-500">Category: {item.category}</p>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Description: {item.description}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Allergens: {item.allergens}
                </p>
              </div>
              <AdminEditDeleteMeal />
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"></div>
        </div>
      </div>
    </div>
  );
}

export default AdminMenuModal;
