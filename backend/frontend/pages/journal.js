import { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Journaling from "../components/Journaling";

export default function JournalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on client side
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <Head>
        <title>Journal - AURA</title>
        <meta
          name="description"
          content="Write and reflect on your thoughts with AURA's journaling feature"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar isAuthenticated={isAuthenticated} />

        {/* Page Header */}
        <div className="pt-24 pb-8 px-4 bg-gradient-to-r from-primary-600 to-purple-600">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              📝 Personal Journal
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Express your thoughts, track your journey, and discover insights
              through the power of writing
            </p>
          </div>
        </div>

        {/* Journaling Component */}
        <Journaling />

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-20">
          <div className="container mx-auto text-center">
            <p className="text-gray-400">
              © 2024 AURA - Your Emotional Intelligence Companion
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

