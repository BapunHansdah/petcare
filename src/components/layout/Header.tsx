import {  LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { signOut } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [notifications] = useState(3); // Example notification count

  const handleSignOut = async () => {
    await signOut();
    navigate("/pet-parent/login");
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link
            to="/"
            className="text-xl  font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"
          >
            <img src="/logo1.jpeg" alt="PetCare Logo" className="h-10 mix-blend-multiply rounded-xl" />
          </Link>
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            {/* <button className="relative p-3 text-gray-600 hover:text-blue-600 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group">
              <Bell
                size={20}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-pulse">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button> */}

            {/* Settings */}
            <button className="relative p-3 text-gray-600 hover:text-blue-600 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group">
              <Settings
                size={20}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative p-3 text-gray-600 hover:text-blue-600 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <User
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl shadow-black/10 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100/50">
                    <p className="text-sm font-semibold text-gray-800">
                      Pet Parent
                    </p>
                    <p className="text-xs text-gray-500">Manage your account</p>
                  </div>

                  <Link
                    to="/pet-parent/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-white/60 hover:text-blue-600 transition-all duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User size={16} className="mr-3" />
                    Profile Settings
                  </Link>

                  <Link
                    to="/pet-parent/settings"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-white/60 hover:text-blue-600 transition-all duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings size={16} className="mr-3" />
                    Preferences
                  </Link>

                  <hr className="my-2 border-gray-100/50" />

                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/60 hover:text-red-700 transition-all duration-200"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
}
