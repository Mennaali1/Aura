import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function GroundingTechniques() {
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  // Fetch grounding techniques data using React Query
  const {
    data: groundingData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["groundingTechniques"],
    queryFn: async () => {
      const response = await fetch("/data/grounding-techniques.json");
      if (!response.ok) {
        throw new Error("Failed to fetch grounding techniques");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // Data stays fresh for 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

  // Extract techniques and tips from the fetched data
  const techniques = groundingData?.techniques || [];
  const tips = groundingData?.tips || [];

  // Loading state
  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center text-red-600">
            <p className="text-xl font-semibold mb-2">
              Failed to load grounding techniques
            </p>
            <p className="text-gray-600">{error?.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Grounding Techniques
          </h2>
          <p className="text-lg text-gray-600">
            Practical tools to help you stay present and manage overwhelming
            emotions
          </p>
        </div>

        {/* Techniques Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {techniques.map((technique) => (
            <div
              key={technique.id}
              className={`card cursor-pointer transition-all duration-300 ${
                selectedTechnique === technique.id
                  ? "border-primary-500 shadow-lg"
                  : "border-gray-200 hover:border-primary-300"
              }`}
              onClick={() =>
                setSelectedTechnique(
                  selectedTechnique === technique.id ? null : technique.id
                )
              }
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {technique.name}
                </h3>
                <span className="text-2xl text-gray-400">
                  {selectedTechnique === technique.id ? "−" : "+"}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{technique.description}</p>

              {/* Expanded Details */}
              {selectedTechnique === technique.id && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      How to do it:
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                      {technique.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Benefits:
                    </h4>
                    <p className="text-gray-700">{technique.benefits}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tips Section - Dynamically rendered from JSON */}
        {tips.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Tips for Success
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {tips.map((tip) => (
                <div
                  key={tip.id}
                  className={`text-center p-6 bg-${tip.color}-50 rounded-lg`}
                >
                  <div className="text-3xl mb-4">{tip.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {tip.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
