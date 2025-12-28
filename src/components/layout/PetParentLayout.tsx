import { Outlet, Link, useNavigate } from "react-router-dom";
import { Heart, Calendar, Home } from "lucide-react";
import Header from "./Header";
import { useEffect, useState } from "react";

export function PetParentLayout() {
  // const path = window.location.pathname;
  const [path, setPath] = useState(window.location.pathname);

  const navigate = useNavigate();

  useEffect(() => {
    setPath(window.location.pathname);
  }, [navigate]);

  return (
    <div className="min-h-screen gradient_background">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar for larger screens */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-medium text-gray-700">Pet Parent Portal</h2>
            </div>
            <nav className="p-2">
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/pet-parent"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                    style={{
                      backgroundColor: path === "/pet-parent" ? "#f3f4f6" : "",
                    }}
                  >
                    <Home size={18} />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pet-parent/dogs"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                    style={{
                      backgroundColor:
                        path === "/pet-parent/dogs" ? "#f3f4f6" : "",
                    }}
                  >
                    <Heart size={18} />
                    <span>My Dogs</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pet-parent/reminders"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                    style={{
                      backgroundColor:
                        path === "/pet-parent/reminders" ? "#f3f4f6" : "",
                    }}
                  >
                    <Calendar size={18} />
                    <span>Reminders</span>
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/pet-parent/history"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    <History size={18} />
                    <span>Visit History</span>
                  </Link>
                </li> */}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Mobile bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 md:hidden">
          <div className="flex justify-around">
            <Link
              to="/pet-parent"
              className="py-3 flex flex-col items-center text-gray-700"
              style={{ color: path === "/pet-parent" ? "black" : "gray" }}
            >
              <Home size={20} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              to="/pet-parent/dogs"
              className="py-3 flex flex-col items-center text-gray-700"
              style={{ color: path === "/pet-parent/dogs" ? "black" : "gray" }}
            >
              <Heart size={20} />
              <span className="text-xs mt-1">Dogs</span>
            </Link>
            <Link
              to="/pet-parent/reminders"
              className="py-3 flex flex-col items-center text-gray-700"
              style={{
                color: path === "/pet-parent/reminders" ? "black" : "gray",
              }}
            >
              <Calendar size={20} />
              <span className="text-xs mt-1">Reminders</span>
            </Link>
            {/* <Link
              to="/pet-parent/history"
              className="py-3 flex flex-col items-center text-gray-700"
              style={{ color: path === "/pet-parent/history" ? "black" : "gray" }}
            >
              <History size={20} />
              <span className="text-xs mt-1">History</span>
            </Link> */}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-16 md:pb-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
