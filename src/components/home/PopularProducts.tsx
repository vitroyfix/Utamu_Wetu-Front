"use client";

import React, { useState, useEffect } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "../../lib/queries";
import { usePopularProducts } from "../../hooks/useStore";
import Image from "next/image";
import Link from "next/link";

export default function PopularProducts() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [mounted, setMounted] = useState(false);

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
  };
  // -------------------------

  useEffect(() => {
    if (products) console.log("Current Products Data:", products);
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
          <div className="flex flex-wrap gap-4 md:gap-6">
            <button
              onClick={() => setActiveCategory("All")}
              className={`text-sm font-bold transition-colors ${
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
                  className={`text-sm font-bold transition-colors ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse border border-gray-100 rounded-2xl p-4 h-[350px] bg-gray-50"
                />
              ))
            : products.map((product: any) => {
                const imageUrl = product.images?.[0]?.image;
                const productLink = `/product/${product.slug}`;

                return (
                  <div
                    key={product.id}
                    className="border border-gray-100 rounded-2xl p-4 relative group hover:border-[#3BB77E] hover:shadow-lg transition-all flex flex-col bg-white"
                  >
                    {product.isHotDeal && (
                      <span className="absolute top-0 left-0 bg-[#FD6E6E] text-white text-[10px] px-4 py-1.5 rounded-tl-2xl rounded-br-2xl font-bold z-10">
                        Hot
                      </span>
                    )}

                    <Link href={productLink} className="cursor-pointer">
                      <div className="h-44 flex items-center justify-center mb-4 mt-2 overflow-hidden bg-white-50 rounded-lg relative">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.title}
                            width={150}
                            height={150}
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <span className="text-3xl mb-1">N/A</span>
                            <span className="text-[10px] uppercase font-bold">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex flex-col flex-grow">
                      <span className="text-gray-400 text-[11px] mb-1">
                        {product.category?.name || "General"}
                      </span>

                      <Link href={productLink}>
                        <h3 className="text-[#253D4E] font-bold text-[14px] leading-tight mb-2 h-10 line-clamp-2 hover:text-[#3BB77E] transition-colors cursor-pointer">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1 mb-1">
                        <Star
                          size={12}
                          className="fill-[#FDC040] text-[#FDC040]"
                        />
                        <span className="text-gray-400 text-xs">(4.0)</span>
                        {product.weight && (
                          <span className="text-gray-500 text-[10px] ml-2 font-medium bg-gray-100 px-1 rounded">
                            {product.weight.value}
                            {product.weight.unit}
                          </span>
                        )}
                      </div>

                      <div className="text-xs mb-4">
                        <span className="text-gray-400">By </span>
                        <span className="text-[#3BB77E] hover:underline cursor-pointer">
                          {product.brand?.name || "Utamu Wetu"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[#3BB77E] font-bold text-lg">
                            KES {parseFloat(product.price).toLocaleString()}
                          </span>
                          {product.oldPrice && (
                            <span className="text-gray-400 text-xs line-through">
                              KES{" "}
                              {parseFloat(product.oldPrice).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {/* ATTACHED ADD TO CART HANDLER HERE */}
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1 transition-all active:scale-95"
                        >
                          <ShoppingCart size={14} />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
