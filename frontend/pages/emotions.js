import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";

export default function EmotionsDashboard() {
  const queryClient = useQueryClient();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("week"); // week, month, all
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch emotions data from backend API
  const {
    data: emotions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["emotions", filterPeriod],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://aura-backend-11z6.onrender.com/api/emotions?period=${filterPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch emotions");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isClient && !!localStorage.getItem("token"), // Only fetch if logged in and on client
  });

  // Fetch emotion statistics
  const { data: stats } = useQuery({
    queryKey: ["emotionStats"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("https://aura-backend-11z6.onrender.com/api/emotions/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch emotion stats");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    enabled: isClient && !!localStorage.getItem("token"), // Only fetch if on client and logged in
  });

  // Save emotion mutation
  const saveEmotionMutation = useMutation({
    mutationFn: async (emotionData) => {
      const token = localStorage.getItem("token");
      const response = await fetch("https://aura-backend-11z6.onrender.com/api/emotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emotionData),
      });
      if (!response.ok) {
        throw new Error("Failed to save emotion");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["emotions"]);
      queryClient.invalidateQueries(["emotionStats"]);
      setSelectedEmotion(null);
      setIntensity(5);
      setNote("");
    },
  });

  // Emotion categories with colors
  const emotionCategories = [
    {
      category: "Happy",
      emotions: ["Joy", "Excited", "Grateful", "Proud", "Peaceful"],
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: "😊",
    },
    {
      category: "Sad",
      emotions: ["Down", "Disappointed", "Lonely", "Hurt", "Depressed"],
      color: "bg-blue-100 text-blue-800 border-blue-300",
      icon: "😢",
    },
    {
      category: "Angry",
      emotions: ["Frustrated", "Annoyed", "Furious", "Irritated", "Resentful"],
      color: "bg-red-100 text-red-800 border-red-300",
      icon: "😠",
    },
    {
      category: "Anxious",
      emotions: ["Worried", "Nervous", "Scared", "Overwhelmed", "Stressed"],
      color: "bg-purple-100 text-purple-800 border-purple-300",
      icon: "😰",
    },
    {
      category: "Calm",
      emotions: ["Relaxed", "Content", "Serene", "Balanced", "Tranquil"],
      color: "bg-green-100 text-green-800 border-green-300",
      icon: "😌",
    },
    {
      category: "Confused",
      emotions: ["Uncertain", "Perplexed", "Indecisive", "Doubtful", "Lost"],
      color: "bg-gray-100 text-gray-800 border-gray-300",
      icon: "😕",
    },
  ];

  // Handle emotion submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmotion) {
      alert("Please select an emotion");
      return;
    }

    saveEmotionMutation.mutate({
      emotion: selectedEmotion,
      intensity,
      note,
      timestamp: new Date().toISOString(),
    });
  };

  // Calculate emotion frequency for stats
  const getEmotionFrequency = () => {
    if (!emotions || emotions.length === 0) return [];

    const frequency = {};
    emotions.forEach((emotion) => {
      frequency[emotion.emotion] = (frequency[emotion.emotion] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([emotion, count]) => ({ emotion, count }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Emotion Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Track, understand, and manage your emotional well-being
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalEmotions || 0}
              </div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.thisWeek || 0}
              </div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.streakDays || 0}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-2">
                {stats.dominantEmotion?.icon || "😊"}
              </div>
              <div className="text-xl font-bold text-gray-900">
                {stats.dominantEmotion?.name || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Most Common</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Track Emotion */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                How are you feeling right now?
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Emotion Categories */}
                <div className="space-y-4 mb-6">
                  {emotionCategories.map((category) => (
                    <div key={category.category}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="text-2xl mr-2">{category.icon}</span>
                        {category.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {category.emotions.map((emotion) => (
                          <button
                            key={emotion}
                            type="button"
                            onClick={() => setSelectedEmotion(emotion)}
                            className={`px-4 py-2 rounded-full border-2 transition-all ${
                              selectedEmotion === emotion
                                ? category.color + " font-semibold scale-105"
                                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {emotion}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Intensity Slider */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Intensity: {intensity}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Intense</span>
                  </div>
                </div>

                {/* Note */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Add a note (optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What triggered this emotion? What are you thinking about?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="4"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedEmotion || saveEmotionMutation.isPending}
                  className="w-full btn btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveEmotionMutation.isPending ? "Saving..." : "Save Emotion"}
                </button>
              </form>
            </div>

            {/* Recent Emotions History */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Emotion History
                </h2>
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : isError ? (
                <div className="text-center text-red-600 py-8">
                  <p>Failed to load emotions</p>
                  <p className="text-sm">{error?.message}</p>
                </div>
              ) : emotions && emotions.length > 0 ? (
                <div className="space-y-4">
                  {emotions.slice(0, 10).map((emotion, index) => (
                    <div
                      key={emotion._id || index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold text-gray-900 text-lg">
                            {emotion.emotion}
                          </span>
                          <span className="ml-3 text-sm text-gray-600">
                            Intensity: {emotion.intensity}/10
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(emotion.timestamp).toLocaleDateString()} at{" "}
                          {new Date(emotion.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {emotion.note && (
                        <p className="text-gray-600 text-sm">{emotion.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-lg mb-2">No emotions tracked yet</p>
                  <p className="text-sm">
                    Start tracking your emotions to see your history here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Insights */}
          <div className="space-y-8">
            {/* Top Emotions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Top Emotions
              </h3>
              {emotions && emotions.length > 0 ? (
                <div className="space-y-3">
                  {getEmotionFrequency().map((item) => (
                    <div
                      key={item.emotion}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-800">
                        {item.emotion}
                      </span>
                      <span className="text-sm text-gray-600">
                        {item.count} times
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No data available yet</p>
              )}
            </div>

            {/* Helpful Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                💡 Helpful Tips
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ Track emotions daily for better insights</li>
                <li>✓ Note patterns and triggers</li>
                <li>✓ Use intensity to measure progress</li>
                <li>✓ Review weekly to understand trends</li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <a
                  href="/"
                  className="block w-full btn btn-outline text-center py-3"
                >
                  🧘 Grounding Exercises
                </a>
                <a
                  href="/"
                  className="block w-full btn btn-outline text-center py-3"
                >
                  📝 Journal
                </a>
                <a
                  href="/"
                  className="block w-full btn btn-outline text-center py-3"
                >
                  💬 Therapy Resources
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
