import { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import GroundingTechniques from "../components/GroundingTechniques";
import TherapyResources from "../components/TherapyResources";

export default function GroundingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on client side
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <Head>
        <title>Resources - AURA</title>
        <meta
          name="description"
          content="Grounding techniques and therapy resources for mental wellness"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar isAuthenticated={isAuthenticated} />

        {/* Page Header */}
        <div className="pt-24 pb-8 px-4 bg-gradient-to-r from-green-600 to-teal-600">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🧘 Wellness Resources
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Discover grounding techniques and professional therapy resources
              to support your mental health journey
            </p>
          </div>
        </div>

        {/* Grounding Techniques Component */}
        <GroundingTechniques />

        {/* Therapy Resources Component */}
        <TherapyResources />

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

