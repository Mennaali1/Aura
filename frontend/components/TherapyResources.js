import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function TherapyResources() {
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch therapy resources data using React Query
  const {
    data: therapyData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["therapyResources"],
    queryFn: async () => {
      const response = await fetch("/data/therapy-resources.json");
      if (!response.ok) {
        throw new Error("Failed to fetch therapy resources");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // Data stays fresh for 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

  // Extract resources and emergency contacts from the fetched data
  const resources = therapyData?.resources || [];
  const emergencyContacts = therapyData?.emergencyContacts || [];

  // Filter resources based on type and search term
  const filteredResources = resources.filter((resource) => {
    const matchesType =
      selectedType === "all" || resource.type === selectedType;
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesType && matchesSearch;
  });

  // Generate star rating display
  const getStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-gray-50">
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center text-red-600">
            <p className="text-xl font-semibold mb-2">
              Failed to load therapy resources
            </p>
            <p className="text-gray-600">{error?.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Therapy & Mental Health Resources
          </h2>
          <p className="text-lg text-gray-600">
            Find qualified mental health professionals in your area
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>

            <div className="flex gap-2">
              <button
                className={`btn ${
                  selectedType === "all" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setSelectedType("all")}
              >
                All Resources
              </button>
              <button
                className={`btn ${
                  selectedType === "therapy" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setSelectedType("therapy")}
              >
                Therapists
              </button>
              <button
                className={`btn ${
                  selectedType === "psychiatrist"
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
                onClick={() => setSelectedType("psychiatrist")}
              >
                Psychiatrists
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {resource.name}
                  </h3>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                    {resource.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-yellow-500">
                    {getStars(resource.rating)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {resource.rating} ({resource.reviews} reviews)
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{resource.description}</p>

              {/* Contact Information */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📍</span>
                  <span>{resource.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📞</span>
                  <a
                    href={`tel:${resource.phone}`}
                    className="hover:text-primary-600"
                  >
                    {resource.phone}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">✉️</span>
                  <a
                    href={`mailto:${resource.email}`}
                    className="hover:text-primary-600"
                  >
                    {resource.email}
                  </a>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Specialties:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {resource.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Contacts Section - Dynamically rendered from JSON */}
        {emergencyContacts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Emergency Contacts - مصر (Egypt)
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`bg-${contact.color}-50 border border-${contact.color}-200 rounded-lg p-6`}
                >
                  <div className="text-3xl mb-4">{contact.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {contact.title}
                  </h4>
                  <div className="space-y-2 text-sm">
                    {contact.contacts.map((item, index) => (
                      <div key={index}>
                        <strong>{item.label}:</strong>
                        <div
                          className={`text-${contact.color}-600 font-semibold`}
                        >
                          {item.number}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
