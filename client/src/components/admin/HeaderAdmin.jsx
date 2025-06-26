import React from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeaderAdmin = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-blue-600 cursor-pointer h-16 flex items-center px-6 justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-white hover:bg-blue-700 p-2 rounded-lg transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-white text-xl font-semibold">Admin Dashboard</h1>
      </div>
      <button 
        onClick={() => navigate('/')} 
        className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors duration-200"
      >
        GoToHomePage
      </button>
    </header>
  );
};

export default HeaderAdmin;
