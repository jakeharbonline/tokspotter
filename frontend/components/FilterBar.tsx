"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

interface FilterBarProps {
  onCategoryChange: (category: string | null) => void;
}

export default function FilterBar({ onCategoryChange }: FilterBarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-gray-700">Category:</label>
      <select
        value={selectedCategory || ""}
        onChange={(e) => handleCategoryChange(e.target.value || null)}
        className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-tiktok-primary focus:ring-tiktok-primary sm:text-sm px-3 py-2 border"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {selectedCategory && (
        <button
          onClick={() => handleCategoryChange(null)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      )}
    </div>
  );
}
