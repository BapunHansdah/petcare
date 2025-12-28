import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ClipboardList, Users, Home } from "lucide-react";
import Header from "./Header";
import { useEffect, useState } from "react";

export function AppLayout() {
  const { userRole } = useSelector((state: RootState) => state.auth);
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
              <h2 className="font-medium text-gray-700">
                {userRole === "hospital" ? "Hospital Admin" : "Doctor"}
              </h2>
            </div>
            <nav className="p-2">
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                    style={{ backgroundColor: path === "/" ? "#f3f4f6" : "" }}
                  >
                    <Home size={18} />
                    <span>Dashboard</span>
                  </Link>
                </li>
                {userRole === "hospital" && (
                  <>
                    <li>
                      <Link
                        to="/doctors"
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                        style={{
                          backgroundColor: path === "/doctors" ? "#f3f4f6" : "",
                        }}
                      >
                        <Users size={18} />
                        <span>Doctors</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/patients"
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                        style={{
                          backgroundColor:
                            path === "/patients" ? "#f3f4f6" : "",
                        }}
                      >
                        <ClipboardList size={18} />
                        <span>Patients</span>
                      </Link>
                    </li>
                  </>
                )}
                {userRole === "doctor" && (
                  <li>
                    <Link
                      to="/cases"
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                      style={{
                        backgroundColor: path === "/cases" ? "#f3f4f6" : "",
                      }}
                    >
                      <ClipboardList size={18} />
                      <span>Patient Cases</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Mobile bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 md:hidden">
          <div className="flex justify-around">
            <Link
              to="/"
              className="py-3 flex flex-col items-center"
              style={{ color: path === "/" ? "black" : "gray" }}
            >
              <Home size={20} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            {userRole === "hospital" ? (
              <>
                <Link
                  to="/doctors"
                  className="py-3 flex flex-col items-center text-gray-700"
                  style={{ color: path === "/doctors" ? "black" : "gray" }}
                >
                  <Users size={20} />
                  <span className="text-xs mt-1">Doctors</span>
                </Link>
                <Link
                  to="/patients"
                  className="py-3 flex flex-col items-center text-gray-700"
                  style={{ color: path === "/patients" ? "black" : "gray" }}
                >
                  <ClipboardList size={20} />
                  <span className="text-xs mt-1">Patients</span>
                </Link>
              </>
            ) : (
              <Link
                to="/cases"
                className="py-3 flex flex-col items-center text-gray-700"
                style={{ color: path === "/cases" ? "black" : "gray" }}
              >
                <ClipboardList size={20} />
                <span className="text-xs mt-1">Cases</span>
              </Link>
            )}
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
