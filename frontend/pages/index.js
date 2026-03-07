import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import EmotionsSection from "../components/EmotionsSection";
import Journaling from "../components/Journaling";
import GroundingTechniques from "../components/GroundingTechniques";
import TherapyResources from "../components/TherapyResources";

// Fetch emotions data from backend API
async function fetchEmotions() {
  const response = await fetch(
    `${process.env.BACKEND_URL || "http://localhost:5000"}/api/emotions`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch emotions");
  }
  return response.json();
}

// Main homepage component with SSR capabilities
export default function Home({ initialEmotions = [] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on client side
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Use React Query to fetch emotions data with SSR fallback
  const {
    data: emotions = initialEmotions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["emotions"],
    queryFn: fetchEmotions,
    // Use SSR data initially, then refetch on client
    initialData: initialEmotions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <>
      <Head>
        <title>AURA - Emotional Intelligence Platform</title>
        <meta
          name="description"
          content="Your personal emotional wellness companion with journaling, grounding techniques, and therapy resources."
        />
        <meta
          name="keywords"
          content="emotional intelligence, mental health, journaling, therapy, wellness"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar isAuthenticated={isAuthenticated} />

        <main>
          {/* Hero section with call-to-action */}
          <HeroSection />

          {/* Emotions section with data from backend */}
          <EmotionsSection
            emotions={emotions}
            isLoading={isLoading}
            error={error}
          />

          {/* Journaling section - only show if authenticated */}
          {isAuthenticated && <Journaling />}

          {/* Grounding techniques - always available */}
          <GroundingTechniques />

          {/* Therapy resources - always available */}
          <TherapyResources />
        </main>
      </div>
    </>
  );
}

// Server-side rendering function to fetch initial data
export async function getServerSideProps() {
  try {
    // Fetch emotions data on the server for faster initial load
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/api/emotions`);

    if (!response.ok) {
      throw new Error("Failed to fetch emotions");
    }

    const emotions = await response.json();

    return {
      props: {
        initialEmotions: emotions,
      },
    };
  } catch (error) {
    console.error("Error fetching emotions:", error);

    // Return empty data if backend is not available
    return {
      props: {
        initialEmotions: [],
      },
    };
  }
}
