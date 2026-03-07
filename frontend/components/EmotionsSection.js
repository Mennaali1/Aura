import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EmotionsSection({ emotions, isLoading, error }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Handle navigation to emotions dashboard
  const handleLogFeelings = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      router.push('/emotions');
    }
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-900">
              Understanding Your Emotional Landscape
            </h2>
            <p className="text-lg text-gray-600">
              Our comprehensive emotions wheel helps you navigate the complex world of human emotions. 
              With over 500 distinct emotional states organized into three levels, you can explore 
              the depth and nuance of your feelings like never before.
            </p>
            
            {/* Emotion Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <h3 className="text-2xl font-bold text-blue-600 mb-2">7</h3>
                <p className="text-gray-700">Primary Emotions</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <h3 className="text-2xl font-bold text-green-600 mb-2">42</h3>
                <p className="text-gray-700">Secondary Emotions</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <h3 className="text-2xl font-bold text-purple-600 mb-2">504</h3>
                <p className="text-gray-700">Tertiary Emotions</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="btn btn-secondary">Explore the Wheel</button>
              <button onClick={handleLogFeelings} className="btn btn-primary">
                Log Your Feelings
              </button>
            </div>
          </div>

          {/* Emotions Wheel Image */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/feelings-wheel.png"
                alt="Emotions Wheel"
                className="w-80 h-80 object-contain hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback image if local image fails to load
                  e.target.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                }}
              />
              
              {/* Loading indicator for emotions data */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <div className="spinner"></div>
                </div>
              )}
              
              {/* Error state */}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
                  <p className="text-red-600 text-sm">Failed to load emotions data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
