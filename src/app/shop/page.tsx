"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client/react"; 
import { gql } from "@apollo/client"
// Swapped to GET_ALL_PRODUCTS to remove the "popular" filter
import { GET_ALL_PRODUCTS } from "../../lib/queries";
import { ShoppingCart, LayoutGrid, List, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// 1. ADDED CATEGORIES QUERY
const GET_CATEGORIES = gql`
  query GetCategories {
    allCategories {
      id
      name
      slug
    }
  }
`;

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  // State to track which item was just added
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  // 2. FETCH CATEGORIES FROM BACKEND
  const { data: catData, loading: catLoading } = useQuery(GET_CATEGORIES);
  
  // FETCH ALL PRODUCTS BASED ON SELECTED CATEGORY
  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS, {
    variables: { 
      categoryName: selectedCategory,
      maxPrice: 10000 
    },
    fetchPolicy: "network-only", // Ensures fresh data from server
  });

  // Map to allProducts instead of popularProducts
  const rawProducts = data?.allProducts || [];
  const categories = catData?.allCategories || [];

  // SORTING LOGIC: Enabled sorting for newest, price-low, and price-high
  const products = [...rawProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return parseFloat(a.price) - parseFloat(b.price);
    }
    if (sortBy === "price-high") {
      return parseFloat(b.price) - parseFloat(a.price);
    }
    if (sortBy === "newest") {
      // Assuming higher ID or a 'createdAt' field denotes newer items
      return parseInt(b.id) - parseInt(a.id);
    }
    return 0;
  });

  const addToCart = (product: any) => {
    const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].qty += 1;
    } else {
      currentCart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));

    // Provide visual feedback
    setAddedItemId(product.id);
    setTimeout(() => setAddedItemId(null), 2000);
  };

  return (
    <div className="bg-[#fcfdfd] min-h-screen">
      {/* 1. HEADER SECTION */}
      <div className="bg-[#3BB77E] py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-white text-4xl font-black mb-4">Shop Our Fresh Groceries</h1>
          <p className="text-white/80 max-w-xl mx-auto text-sm">
            From organic fruits to farm-fresh vegetables, get the best quality ingredients delivered to your doorstep.
          </p>
        </div>
      </div>

      {/* 2. DYNAMIC CATEGORY TOP NAVIGATION */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth">
              {/* Manual "All Products" button */}
              <button
                onClick={() => setSelectedCategory(null)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === null
                    ? "bg-[#3BB77E] text-white shadow-md shadow-[#3BB77E]/20"
                    : "text-[#253D4E] hover:text-[#3BB77E] hover:bg-[#def9ec]"
                }`}
              >
                All Products
              </button>

              {/* Dynamic Backend Categories */}
              {catLoading ? (
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-24 h-9 bg-gray-50 rounded-full animate-pulse shrink-0" />
                  ))}
                </div>
              ) : (
                categories.map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)} 
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${
                      selectedCategory === cat.name
                        ? "bg-[#3BB77E] text-white shadow-md shadow-[#3BB77E]/20"
                        : "text-[#253D4E] hover:text-[#3BB77E] hover:bg-[#def9ec]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))
              )}
            </div>
            
            {/* Sorting Controls */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <SlidersHorizontal size={14} /> Sort By:
                <select 
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value)}
                   className="text-[#253D4E] bg-transparent outline-none font-bold cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT GRID */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <p className="text-gray-400 text-sm font-medium">
            Showing <span className="text-[#3BB77E] font-bold">{selectedCategory || "All"}</span>: 
            <span className="ml-1 text-[#3BB77E] font-bold">{products.length}</span> items found
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.length > 0 ? products.map((item: any) => (
              <div 
                key={item.id} 
                className="group border border-gray-100 rounded-[2rem] p-4 bg-white hover:border-[#3BB77E] hover:shadow-xl transition-all duration-300"
              >
                <Link href={`/product/${item.slug}`}>
                  <div className="relative aspect-square mb-4 bg-[#f9fbfb] rounded-2xl overflow-hidden w-full">
                    <Image 
                      src={item.images?.[0]?.image || "/placeholder.webp"} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      unoptimized 
                    />
                  </div>
                </Link>
                <div className="space-y-2">
                  <span className="text-[10px] text-[#3BB77E] font-bold uppercase">{item.category?.name}</span>
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-[#253D4E] font-bold text-sm h-10 line-clamp-2 hover:text-[#3BB77E] transition-colors">{item.title}</h3>
                  </Link>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                      <span className="text-[#3BB77E] font-black text-lg">KES {parseFloat(item.price).toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      className={`${
                        addedItemId === item.id 
                        ? "bg-orange-500 shadow-orange-200 text-white" 
                        : "bg-[#def9ec] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white"
                      } p-3 rounded-2xl transition-all active:scale-90 flex items-center justify-center`}
                    >
                      {addedItemId === item.id ? (
                        <Check size={18} className="animate-in zoom-in duration-300" />
                      ) : (
                        <ShoppingCart size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 text-lg">No products available in the <span className="font-bold">"{selectedCategory || 'All'}"</span> category yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}