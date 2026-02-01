import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Menu, Bell, User, Settings, Zap, Moon, Sun } from "lucide-react";

import Home from "./pages/Home";
import ResumeRefiner from "./pages/ResumeRefiner";
import ListingFinder from "./pages/ListingFinder";
import Help from "./pages/Help";

import "./App.css";

function RouteTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [key, setKey] = useState(0);
  const [dir, setDir] = useState<"forward" | "back">("forward");

  // Define an order for routes so we can infer direction.
  const order = ["/", "/resume-refiner", "/listing-finder", "/help"];

  const prevIndexRef = useRef<number>(order.indexOf(location.pathname));

  useEffect(() => {
    const nextIndex = order.indexOf(location.pathname);
    const prevIndex = prevIndexRef.current;

    if (nextIndex !== -1 && prevIndex !== -1) {
      setDir(nextIndex >= prevIndex ? "forward" : "back");
      prevIndexRef.current = nextIndex;
    }

    setKey((k) => k + 1);
  }, [location.pathname]);

  const animClass =
    dir === "forward"
      ? "animate-[pageInRight_260ms_ease-out]"
      : "animate-[pageInLeft_260ms_ease-out]";

  return (
    <>
      <style>{`
        @keyframes pageInRight {
          from { opacity: 0; transform: translateX(14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pageInLeft {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div key={key} className={animClass}>
        {children}
      </div>
    </>
  );
}

function Navigation() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const tabs = [
    { id: "/resume-refiner", label: "Resume Refiner" },
    { id: "/listing-finder", label: "Listing Finder" },
    { id: "/help", label: "Help" },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-[#142d4c]" : "bg-[#ececec]"
      }`}
    >
      {/* Toolbar */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-500 ${
          darkMode
            ? "bg-[#142d4c]/95 border-b border-[#9fd3c7]/20"
            : "bg-white/80 border-b border-[#385170]/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Left Section - Logo & Nav */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className={`flex items-center gap-3 group cursor-pointer transition-transform hover:scale-105 ${
                  darkMode ? "text-[#9fd3c7]" : "text-[#385170]"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    darkMode
                      ? "bg-gradient-to-br from-[#9fd3c7] to-[#385170]"
                      : "bg-gradient-to-br from-[#385170] to-[#142d4c]"
                  }`}
                >
                  <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <span
                  className={`font-bold text-xl tracking-tight ${
                    darkMode ? "text-[#ececec]" : "text-[#142d4c]"
                  }`}
                >
                  MPloy
                </span>
              </Link>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-2">
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    to={tab.id}
                    className={`relative px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                      location.pathname === tab.id
                        ? darkMode
                          ? "text-[#9fd3c7]"
                          : "text-[#385170]"
                        : darkMode
                        ? "text-[#9fd3c7]/60 hover:text-[#9fd3c7]"
                        : "text-[#385170]/60 hover:text-[#385170]"
                    }`}
                  >
                    {tab.label}
                    {location.pathname === tab.id && (
                      <div
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-full ${
                          darkMode
                            ? "bg-gradient-to-r from-[#9fd3c7] to-[#385170]"
                            : "bg-gradient-to-r from-[#385170] to-[#142d4c]"
                        }`}
                      />
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
              <button
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? "hover:bg-[#385170]/30 text-[#9fd3c7]/70 hover:text-[#9fd3c7]"
                    : "hover:bg-[#9fd3c7]/20 text-[#385170]/70 hover:text-[#385170]"
                }`}
              >
                <Bell className="w-5 h-5" />
              </button>

              <button
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? "hover:bg-[#385170]/30 text-[#9fd3c7]/70 hover:text-[#9fd3c7]"
                    : "hover:bg-[#9fd3c7]/20 text-[#385170]/70 hover:text-[#385170]"
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? "bg-[#9fd3c7]/10 text-[#9fd3c7] hover:bg-[#9fd3c7]/20"
                    : "bg-[#385170]/10 text-[#385170] hover:bg-[#385170]/20"
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Avatar */}
              <button
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? "bg-gradient-to-br from-[#9fd3c7] to-[#385170]"
                    : "bg-gradient-to-br from-[#385170] to-[#142d4c]"
                }`}
              >
                <User className="w-5 h-5 text-white" />
              </button>

              {/* Mobile Menu */}
              <button
                className={`md:hidden p-2.5 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? "hover:bg-[#385170]/30 text-[#9fd3c7]/70"
                    : "hover:bg-[#9fd3c7]/20 text-[#385170]/70"
                }`}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <RouteTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume-refiner" element={<ResumeRefiner />} />
          <Route path="/listing-finder" element={<ListingFinder />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </RouteTransition>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  );
}

export default App;