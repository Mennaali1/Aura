import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar({ isAuthenticated }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Handle scroll effect for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user data from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse user data:", error);
          // Clear invalid user data
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    }
  }, [isAuthenticated]);

  // Handle user logout
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.reload(); // Refresh to update authentication state
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <h2 className="text-2xl font-bold text-gray-800">AURA</h2>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-primary-600 transition-colors"
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/emotions"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Emotions
              </Link>
              <Link
                href="/journal"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Journal
              </Link>
            </>
          )}
          <Link
            href="/grounding"
            className="text-gray-700 hover:text-primary-600 transition-colors"
          >
            Resources
          </Link>
        </div>

        {/* Authentication Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.name || "User"}!
              </span>
              <button onClick={handleSignOut} className="btn btn-secondary">
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-secondary">
                Login
              </Link>
              <Link href="/auth/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
