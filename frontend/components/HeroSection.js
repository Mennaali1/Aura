import { useState, useEffect } from "react";
import Link from "next/link";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slides data - each slide represents a key feature
  const slides = [
    {
      title: "Identify and Track Your Emotions Visually",
      text: "AURA provides an intuitive visual interface to identify, track, and monitor your emotional patterns over time.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Journaling Prompts for Reflection",
      text: "Enhance your self-awareness with thoughtfully crafted journaling prompts designed to guide your emotional exploration.",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Science-Backed Exercises and Tips",
      text: "Access evidence-based emotional intelligence exercises and practical tips developed by psychologists and emotional wellness experts.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="pt-20 pb-16 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {slides[currentSlide].text}
            </p>
            <div className="flex space-x-4">
              <Link
                href="/auth/register"
                className="btn btn-primary text-lg px-8 py-4"
              >
                Get Started
              </Link>
              <Link
                href="/grounding"
                className="btn btn-outline text-lg px-8 py-4"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="relative animate-slide-up">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-primary-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
