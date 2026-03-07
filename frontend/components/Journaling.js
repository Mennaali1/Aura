import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// API configuration for backend communication
// const NEXT_PUBLIC_BACKEND_URL = process.env.BACKEND_URL ;


// Fetch journals from backend API
async function fetchJournals() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${NEXT_PUBLIC_BACKEND_URL}/api/journals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Create new journal entry
async function createJournal(data) {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${NEXT_PUBLIC_BACKEND_URL}/api/journals`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Update journal entry
async function updateJournal({ id, data }) {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${NEXT_PUBLIC_BACKEND_URL}/api/journals/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Delete journal entry
async function deleteJournal(id) {
  const token = localStorage.getItem("token");
  await axios.delete(`${NEXT_PUBLIC_BACKEND_URL}/api/journals/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export default function Journaling() {
  const [showForm, setShowForm] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [showPrompts, setShowPrompts] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "neutral",
    tags: "",
  });
  const [isClient, setIsClient] = useState(false);

  const queryClient = useQueryClient();

  // Check if we're on the client side (SSR safety)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch journal prompts data using React Query
  const {
    data: promptsData,
    isLoading: promptsLoading,
    isError: promptsError,
  } = useQuery({
    queryKey: ["journalPrompts"],
    queryFn: async () => {
      const response = await fetch("/data/journal-prompts.json");
      if (!response.ok) {
        throw new Error("Failed to fetch journal prompts");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // Data stays fresh for 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

  // Extract prompts from the fetched data
  const journalPrompts = promptsData?.prompts || {};
  const promptCategories = promptsData?.categories || [];

  // Handle prompt selection
  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt);
    setFormData({ ...formData, title: prompt, content: "" });
    setShowPrompts(false);
    setShowForm(true);
  };

  // Fetch journals using React Query
  const { data: journals = [], isLoading } = useQuery({
    queryKey: ["journals"],
    queryFn: fetchJournals,
    // Only fetch if user is authenticated and we're on client side (SSR safe)
    enabled: isClient && !!localStorage.getItem("token"),
  });

  // Create journal mutation
  const createMutation = useMutation({
    mutationFn: createJournal,
    onSuccess: () => {
      queryClient.invalidateQueries(["journals"]);
      setShowForm(false);
      setFormData({ title: "", content: "", mood: "neutral", tags: "" });
    },
  });

  // Update journal mutation
  const updateMutation = useMutation({
    mutationFn: updateJournal,
    onSuccess: () => {
      queryClient.invalidateQueries(["journals"]);
      setShowForm(false);
      setEditingJournal(null);
      setFormData({ title: "", content: "", mood: "neutral", tags: "" });
    },
  });

  // Delete journal mutation
  const deleteMutation = useMutation({
    mutationFn: deleteJournal,
    onSuccess: () => {
      queryClient.invalidateQueries(["journals"]);
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    const data = { ...formData, tags };

    if (editingJournal) {
      updateMutation.mutate({ id: editingJournal._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Mood options for the form
  const moodOptions = [
    { value: "very-happy", label: "Very Happy", emoji: "😄" },
    { value: "happy", label: "Happy", emoji: "😊" },
    { value: "neutral", label: "Neutral", emoji: "😐" },
    { value: "sad", label: "Sad", emoji: "😢" },
    { value: "anxious", label: "Anxious", emoji: "😰" },
    { value: "angry", label: "Angry", emoji: "😠" },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Personal Journal
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Reflect, express, and grow through writing
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              ✍️ New Entry
            </button>
            <button
              onClick={() => setShowPrompts(true)}
              className="btn btn-outline"
            >
              💡 Writing Prompts
            </button>
          </div>
        </div>

        {/* Journal Prompts Modal */}
        {showPrompts && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Journal Writing Prompts</h3>
                <button
                  onClick={() => setShowPrompts(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Loading state for prompts */}
              {promptsLoading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              )}

              {/* Error state for prompts */}
              {promptsError && (
                <div className="text-center text-red-600 py-8">
                  <p className="text-lg font-semibold mb-2">
                    Failed to load journal prompts
                  </p>
                  <p className="text-sm">Please try again later</p>
                </div>
              )}

              {/* Prompts content */}
              {!promptsLoading && !promptsError && (
                <>
                  <p className="text-gray-600 mb-6">
                    Select a prompt to inspire your journaling session
                  </p>

                  <div className="space-y-6">
                    {Object.entries(journalPrompts).map(
                      ([categoryKey, prompts]) => {
                        // Find category metadata if available
                        const categoryInfo = promptCategories.find(
                          (cat) => cat.key === categoryKey
                        );
                        const categoryLabel =
                          categoryInfo?.label ||
                          (categoryKey === "selfCare"
                            ? "Self-Care"
                            : categoryKey.charAt(0).toUpperCase() +
                              categoryKey.slice(1));
                        const categoryIcon = categoryInfo?.icon || "";
                        const categoryDesc = categoryInfo?.description || "";

                        return (
                          <div key={categoryKey}>
                            <h4 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                              {categoryIcon && (
                                <span className="text-xl">{categoryIcon}</span>
                              )}
                              {categoryLabel}
                            </h4>
                            {categoryDesc && (
                              <p className="text-sm text-gray-500 mb-3">
                                {categoryDesc}
                              </p>
                            )}
                            <div className="space-y-2">
                              {prompts.map((prompt, index) => (
                                <button
                                  key={index}
                                  onClick={() => handlePromptSelect(prompt)}
                                  className="w-full text-left p-4 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-lg transition-colors"
                                >
                                  <span className="text-gray-800">
                                    {prompt}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Journal Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {editingJournal ? "Edit Entry" : "New Journal Entry"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="input"
                    placeholder="What's on your mind?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="input"
                    placeholder="Write your thoughts, feelings, and reflections here..."
                    rows="8"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mood
                    </label>
                    <select
                      value={formData.mood}
                      onChange={(e) =>
                        setFormData({ ...formData, mood: e.target.value })
                      }
                      className="input"
                    >
                      {moodOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.emoji} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      className="input"
                      placeholder="gratitude, reflection, goals..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : "Save Entry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Journals Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {journals.map((journal) => (
            <div key={journal._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {journal.title}
                </h3>
                <span className="text-2xl">
                  {moodOptions.find((m) => m.value === journal.mood)?.emoji ||
                    "😐"}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {journal.content.substring(0, 150)}...
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {journal.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(journal.date).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingJournal(journal);
                      setFormData({
                        title: journal.title,
                        content: journal.content,
                        mood: journal.mood,
                        tags: journal.tags.join(", "),
                      });
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(journal._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {journals.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No journal entries yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start your journaling journey by creating your first entry!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Start Journaling
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
