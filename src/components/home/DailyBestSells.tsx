"use client";
import React, { useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { GET_POPULAR_PRODUCTS } from "../../lib/queries";
import Image from "next/image";

export function DailyBestSells() {
  const [activeTab, setActiveTab] = useState("Featured");
  const { data, loading, error } = useQuery(GET_POPULAR_PRODUCTS);
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
  };

  if (error) return null;

  const allBestSells = data?.popularProducts?.filter((p: any) => p.isBestSeller) || [];

  const getFilteredBestSells = () => {
    let filtered = [...allBestSells];
    
    if (activeTab === "Featured") {
      filtered = filtered.filter((p: any) => p.isHotDeal);
    } else if (activeTab === "Popular") {
      filtered = filtered.sort((a: any, b: any) => (b.soldCount || 0) - (a.soldCount || 0));
    } else if (activeTab === "New added") {
      filtered = filtered.reverse(); 
    }
    
    return filtered.slice(0, 4);
  };

  const displayProducts = getFilteredBestSells();

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-[#253D4E] text-2xl md:text-3xl font-bold">
            Daily Best Sells
          </h2>
          <div className="flex gap-6 text-sm font-bold text-[#253D4E]">
            {["Featured", "Popular", "New added"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`transition-all duration-300 ${
                  activeTab === tab ? "text-[#3BB77E] border-b-2 border-[#3BB77E]" : "hover:text-[#3BB77E]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Static Banner */}
          <div className="lg:col-span-1 rounded-3xl bg-[url('/best-sell-banner.jpg')] bg-cover bg-center p-10 flex flex-col justify-start min-h-[480px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors"></div>
            <div className="relative z-10">
              <h3 className="text-white text-3xl font-black leading-tight mb-8">
                Freshly <br /> Harvested <br /> For You
              </h3>
              <button className="bg-[#3BB77E] text-white px-6 py-3 rounded-xl text-sm font-black shadow-xl hover:bg-[#253D4E] transition-all">
                Explore More
              </button>
            </div>
          </div>

          {/* Best Sells Grid */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse border border-gray-100 rounded-[2rem] p-6 h-[480px] bg-gray-50" />
                ))
              : displayProducts.map((product: any) => {
                  const imageUrl = product.images?.[0]?.image;
                  const progress = ((product.soldCount || 0) / (product.totalStock || 100)) * 100;

                  return (
                    <div key={product.id} className="border border-gray-100 rounded-[2rem] p-6 flex flex-col group hover:border-[#3BB77E] hover:shadow-2xl hover:shadow-[#3BB77E]/10 transition-all bg-white relative">
                      {product.isHotDeal}

                      <div className="h-40 flex items-center justify-center mb-6 mt-4">
                        <Image
                          src={imageUrl || "/placeholder.webp"}
                          alt={product.title}
                          width={160}
                          height={160}
                          className="object-contain group-hover:scale-110 transition-transform duration-500"
                          unoptimized
                        />
                      </div>

                      <div className="flex flex-col flex-grow">
                        <span className="text-[#3BB77E] text-[10px] font-black uppercase tracking-widest mb-2">
                          {product.category?.name}
                        </span>
                        <h4 className="text-[#253D4E] font-bold text-sm mb-3 line-clamp-2 leading-snug h-10">
                          {product.title}
                        </h4>

                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < 4 ? "#FDC040" : "none"} className={i < 4 ? "text-[#FDC040]" : "text-gray-200"} />
                          ))}
                        </div>

                        <div className="mb-4">
                          <span className="text-[#3BB77E] font-black text-xl">KES {parseFloat(product.price).toLocaleString()}</span>
                        </div>

                        <div className="mt-auto space-y-4">
                          <div className="space-y-1">
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#3BB77E] h-full rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                            <p className="text-gray-400 text-[10px] font-bold">Sold: {product.soldCount}/{product.totalStock}</p>
                          </div>
                          <button 
                            onClick={() => addToCart(product)}
                            className="w-full bg-[#3BB77E] hover:bg-[#253D4E] text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-[#3BB77E]/20"
                          >
                            <ShoppingCart size={16} /> Add To Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </section>
  );
}