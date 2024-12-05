import React from "react";

const Popup = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
    <div className="bg-white p-2 rounded shadow-lg max-w-sm w-full">
      <p>{message}</p>
      <button
        onClick={onClose}
        className="mt-4 p-2 bg-green-900 text-white rounded items-center"
      >
        Close
      </button>
    </div>
  </div>
);

export default Popup;
