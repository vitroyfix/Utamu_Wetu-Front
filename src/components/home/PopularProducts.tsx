"use client";

import React, { useState, useEffect } from "react";
import { Star, ShoppingCart, Check } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "../../lib/queries";
import { usePopularProducts } from "../../hooks/useStore";
import Image from "next/image";
import Link from "next/link";

export default function PopularProducts() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [mounted, setMounted] = useState(false);
  // Track specifically which item was added for visual feedback
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: catData, loading: catLoading } = useQuery(GET_CATEGORIES);

  const { products, loading, error } = usePopularProducts(activeCategory);

  const addToCart = (product: any) => {
    const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItemIndex = currentCart.findIndex(
      (item: any) => item.id === product.id,
    );

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

  useEffect(() => {
    if (products) console.log("Current Popular Products:", products);
  }, [products]);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  if (error)
    return (
      <div className="text-red-500 p-10 text-center bg-red-50 rounded-xl m-4">
        <p className="font-bold">Error connecting to Utamu Wetu Server:</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );

  return (
    <section className="py-12 bg-white" suppressHydrationWarning>
      <div className="container mx-auto px-4">
        {/* 1. Header & Dynamic Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-[#253D4E] text-2xl md:text-3xl font-bold">
            Popular Products
          </h2>
          <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-6 pb-2 md:pb-0">
            <button
              onClick={() => setActiveCategory("All")}
              className={`text-sm font-bold transition-colors whitespace-nowrap ${
                activeCategory === "All"
                  ? "text-[#3BB77E]"
                  : "text-[#253D4E] hover:text-[#3BB77E]"
              }`}
            >
              All
            </button>

            {!catLoading &&
              catData?.allCategories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`text-sm font-bold transition-colors whitespace-nowrap ${
                    activeCategory === cat.name
                      ? "text-[#3BB77E]"
                      : "text-[#253D4E] hover:text-[#3BB77E]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>

        {/* 2. Product Grid */}
        <div className="flex overflow-x-auto no-scrollbar pb-6 gap-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 md:overflow-visible">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[200px] animate-pulse border border-gray-100 rounded-2xl p-4 h-[320px] bg-gray-50"
                />
              ))
            : products.map((product: any) => {
                const imageUrl = product.images?.[0]?.image;
                const productLink = `/product/${product.slug}`;

                return (
                  <div
                    key={product.id}
                    className="min-w-[200px] sm:min-w-0 snap-start border border-gray-100 rounded-2xl p-3 md:p-4 relative group hover:border-[#3BB77E] hover:shadow-lg transition-all flex flex-col bg-white"
                  >
                    {product.isHotDeal && (
                      <span className="absolute top-0 left-0 bg-[#FD6E6E] text-white text-[9px] px-3 py-1 rounded-tl-2xl rounded-br-2xl font-bold z-10">
                        Hot
                      </span>
                    )}

                    <Link href={productLink} className="cursor-pointer">
                      {/* FIX: Set container to relative with specific height and overflow-hidden */}
                      <div className="h-32 md:h-44 w-full relative mb-3 mt-2 overflow-hidden bg-white rounded-lg">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400 h-full w-full">
                            <span className="text-2xl mb-1">N/A</span>
                            <span className="text-[9px] uppercase font-bold">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex flex-col flex-grow">
                      <span className="text-gray-400 text-[10px] mb-1">
                        {product.category?.name || "General"}
                      </span>

                      <Link href={productLink}>
                        <h3 className="text-[#253D4E] font-bold text-[13px] md:text-[14px] leading-tight mb-2 h-8 md:h-10 line-clamp-2 hover:text-[#3BB77E] transition-colors cursor-pointer">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1 mb-1">
                        <Star
                          size={10}
                          className="fill-[#FDC040] text-[#FDC040]"
                        />
                        <span className="text-gray-400 text-[10px]">(4.0)</span>
                        {product.weight && (
                          <span className="text-gray-500 text-[9px] ml-1.5 font-medium bg-gray-100 px-1 rounded">
                            {product.weight.value}
                            {product.weight.unit}
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] mb-3">
                        <span className="text-gray-400">By </span>
                        <span className="text-[#3BB77E] hover:underline cursor-pointer">
                          {product.brand?.name || "Utamu Wetu"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[#3BB77E] font-bold text-base md:text-lg">
                            KES {parseFloat(product.price).toLocaleString()}
                          </span>
                          {product.oldPrice && (
                            <span className="text-gray-400 text-[10px] line-through">
                              KES{" "}
                              {parseFloat(product.oldPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          className={`px-2 md:px-3 py-1.5 rounded-md text-[11px] md:text-sm font-bold flex items-center gap-1 transition-all active:scale-95 ${
                            addedItemId === product.id
                              ? "bg-orange-500 text-white"
                              : "bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white"
                          }`}
                        >
                          {addedItemId === product.id ? (
                            <>
                              <Check size={14} /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={14} /> Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
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
    </section>
  );
}