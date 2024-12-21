import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md flex items-center justify-between p-4">
      {/* Left Section - Title */}
      <div className="text-orange-500 text-lg font-semibold">Warehouse Management</div>

      {/* Right Section - User Profile */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Hi, Admin</span>
        <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 0v5m0 0H9m3 0h3"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
