"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client"

const GET_SIDEBAR_DATA = gql`
  query GetSidebarData {
    allCategories {
      id
      name
      image
      slug
      maxPrice
      productCount
    }
    allWeights {
      id
      value
      unit
      productCount 
    }
    allTags {
      id
      name
      productCount
    }
  }
`;

export default function ProductSidebar({ onFilterChange }: { onFilterChange?: (filters: any) => void }) {
  const { data } = useQuery(GET_SIDEBAR_DATA);
  const categories = data?.allCategories || [];
  const weights = data?.allWeights || [];
  const tags = data?.allTags || [];

  const [globalMax, setGlobalMax] = useState(5000);
  const [currentPrice, setCurrentPrice] = useState(5000);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Use a ref to track the last sent filters to prevent the infinite loop
  const lastFiltersRef = useRef<string>("");

  useEffect(() => {
    if (categories.length > 0) {
      const highest = Math.max(...categories.map((c: any) => c.maxPrice || 0));
      if (highest > 0) {
        setGlobalMax(highest);
        setCurrentPrice(highest);
      }
    }
  }, [categories]);

  useEffect(() => {
    if (onFilterChange) {
      const currentFilters = {
        category: selectedCategory,
        weight: selectedWeight,
        tag: selectedTag,
        maxPrice: currentPrice
      };
      
      // Stringify for a quick deep equality check
      const filtersString = JSON.stringify(currentFilters);
      
      // ONLY trigger the update if the values have actually changed
      if (lastFiltersRef.current !== filtersString) {
        lastFiltersRef.current = filtersString;
        onFilterChange(currentFilters);
      }
    }
  }, [selectedCategory, selectedWeight, selectedTag, currentPrice, onFilterChange]);

  const toggleCategory = (name: string) => setSelectedCategory(selectedCategory === name ? null : name);
  const toggleWeight = (id: string) => setSelectedWeight(selectedWeight === id ? null : id);
  const toggleTag = (name: string) => setSelectedTag(selectedTag === name ? null : name);

  const progressPercent = (currentPrice / globalMax) * 100;

  return (
    <aside className="hidden lg:flex flex-col gap-6 w-72 shrink-0">
      {/* 1. Category Card */}
      <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
        <h3 className="text-[#253D4E] font-bold text-lg mb-4 pb-2 border-b">Product Category</h3>
        <ul className="space-y-3">
          {categories.map((cat: any) => (
            <li 
              key={cat.id} 
              className="flex items-center justify-between text-sm text-gray-600 hover:text-[#3BB77E] cursor-pointer group"
              onClick={() => toggleCategory(cat.name)}
            >
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={selectedCategory === cat.name}
                  readOnly 
                  className="accent-[#3BB77E] w-4 h-4 cursor-pointer" 
                />
                <span className={selectedCategory === cat.name ? "text-[#3BB77E] font-bold" : ""}>{cat.name}</span>
              </div>
              <span className="text-gray-400 group-hover:text-[#3BB77E] font-medium">[{cat.productCount || 0}]</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Green Price Slider */}
      <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
        <h3 className="text-[#253D4E] font-bold text-lg mb-4">Filter By Price</h3>
        <div className="relative mb-6 pt-2">
          <div className="h-1.5 bg-gray-100 rounded-full w-full"></div>
          <div 
            className="absolute h-1.5 bg-[#3BB77E] top-2 rounded-full pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          ></div>
          <input 
            type="range" 
            min="0" 
            max={globalMax} 
            value={currentPrice}
            onChange={(e) => setCurrentPrice(parseInt(e.target.value))}
            className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer accent-[#3BB77E]"
          />
          <div className="absolute w-4 h-4 bg-[#3BB77E] border-2 border-white rounded-full top-0.5 left-0 shadow-sm pointer-events-none"></div>
          <div 
            className="absolute w-4 h-4 bg-[#3BB77E] border-2 border-white rounded-full top-0.5 shadow-sm pointer-events-none"
            style={{ left: `calc(${progressPercent}% - 8px)` }}
          ></div>
        </div>
        <div className="text-sm font-bold text-gray-700">
          Price : <span className="text-gray-400 font-normal ml-1">KES 0 — KES {currentPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* 3. Weight Grouping */}
      <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
        <h3 className="text-[#253D4E] font-bold text-lg mb-4 pb-2 border-b">Weight</h3>
        <ul className="space-y-3">
          {weights.map((w: any) => (
            <li 
              key={w.id} 
              className="flex items-center justify-between text-sm text-gray-600 hover:text-[#3BB77E] cursor-pointer group"
              onClick={() => toggleWeight(w.id)}
            >
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={selectedWeight === w.id}
                  readOnly 
                  className="accent-[#3BB77E] w-4 h-4 cursor-pointer" 
                />
                <span className={selectedWeight === w.id ? "text-[#3BB77E] font-bold" : ""}>{w.value}{w.unit} Pack</span>
              </div>
              <span className="text-gray-400 group-hover:text-[#3BB77E]">[{w.productCount || 0}]</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Product Tags */}
      <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
        <h3 className="text-[#253D4E] font-bold text-lg mb-4">Product Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: any) => (
            <button 
              key={tag.id} 
              onClick={() => toggleTag(tag.name)}
              className={`border px-3 py-1.5 rounded text-[11px] transition-all font-bold ${
                selectedTag === tag.name 
                ? "bg-[#3BB77E] text-white border-[#3BB77E]" 
                : "bg-gray-50 border-gray-100 text-gray-500 hover:border-[#3BB77E] hover:text-[#3BB77E]"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}