"use client";
import { useState, useEffect } from 'react';
import { categoriesApi } from '../lib/api';

export default function DynamicCategories({ onCategorySelect, selectedCategory = null }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch parent categories (categories without parent)
        // Fetch categories with cache busting
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${base}/api/v1/categories/tree?t=${Date.now()}`);
        const data = await response.json();
        
        if (data.success) {
          // Filter to get only parent categories (those without a parent)
          const parentCategories = data.data.filter(category => !category.parent);
          console.log('Fetched parent categories:', parentCategories);
          setCategories(parentCategories);
        } else {
          throw new Error(data.message || 'Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
        // Fallback to empty array
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 mb-12 sm:mb-16 justify-center px-4">
        {/* Loading skeleton */}
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg animate-pulse"
            style={{ backgroundColor: '#f3f4f6' }}
          >
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || categories.length === 0) {
    // Fallback to static categories if API fails
    const fallbackCategories = [
      { name: 'Destinations', slug: 'destinations', color: '#3514EE' },
      { name: 'Vacations', slug: 'vacations', color: '#4A64E6' },
      { name: 'Tours', slug: 'tours', color: '#4A64E6' }
    ];
    
    return (
      <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 mb-12 sm:mb-16 justify-center px-4">
        {fallbackCategories.map((category, index) => (
          <button
            key={category.slug}
            onClick={() => onCategorySelect && onCategorySelect(category)}
            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-white rounded-lg font-medium transition-colors text-sm sm:text-base md:text-lg ${
              selectedCategory === category.slug
                ? 'border-2 border-white/50'
                : 'border border-white/30 hover:bg-white/10'
            }`}
            style={{ 
              backgroundColor: selectedCategory === category.slug ? category.color : 'transparent'
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 mb-12 sm:mb-16 justify-center px-4">
      {/* Show All Button */}
      <button
        onClick={() => onCategorySelect && onCategorySelect(null)}
        className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-white rounded-lg font-medium transition-colors text-sm sm:text-base md:text-lg ${
          selectedCategory === null
            ? 'border-2 border-white/50'
            : 'border border-white/30 hover:bg-white/10'
        }`}
        style={{ 
          backgroundColor: selectedCategory === null ? '#3514EE' : 'transparent'
        }}
      >
        All Articles
      </button>
      
      {/* Category Buttons */}
      {categories.map((category, index) => (
        <button
          key={category._id || category.slug}
          onClick={() => onCategorySelect && onCategorySelect(category)}
          className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-white rounded-lg font-medium transition-colors text-sm sm:text-base md:text-lg ${
            selectedCategory === category.slug
              ? 'border-2 border-white/50'
              : 'border border-white/30 hover:bg-white/10'
          }`}
          style={{ 
            backgroundColor: selectedCategory === category.slug 
              ? (category.color || '#3514EE') 
              : 'transparent'
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
