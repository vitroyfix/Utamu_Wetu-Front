"use client";
import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { GET_POPULAR_PRODUCTS } from "../../lib/queries";
import Image from "next/image";

export function DailyBestSells() {
  const { data, loading, error } = useQuery(GET_POPULAR_PRODUCTS);

  // --- ADD TO CART LOGIC ---
  const addToCart = (product: any) => {
    // 1. Get current cart from localStorage
    const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    
    // 2. Check if product already exists
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

    if (existingItemIndex > -1) {
      // Increment quantity if it exists
      currentCart[existingItemIndex].qty += 1;
    } else {
      // Add as new item with quantity 1
      currentCart.push({ ...product, qty: 1 });
    }

    // 3. Save back to localStorage
    localStorage.setItem("cartItems", JSON.stringify(currentCart));
    
    // 4. Trigger custom event to notify Navbar
    window.dispatchEvent(new Event("cartUpdated"));
  };
  // -------------------------

  if (error) return null;

  const bestSellers =
    data?.allProducts?.filter((p: any) => p.isBestSeller).slice(0, 4) || [];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[#253D4E] text-2xl md:text-3xl font-bold">
            Daily Best Sells
          </h2>
          <div className="flex gap-4 text-sm font-bold text-[#253D4E]">
            {["Featured", "Popular", "New added"].map((tab) => (
              <button
                key={tab}
                className="hover:text-[#3BB77E] transition-colors"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1 rounded-2xl bg-[url('/best-sell-banner.jpg')] bg-cover bg-center p-8 flex flex-col justify-start min-h-[450px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
            <div className="relative z-10">
              <h3 className="text-white text-3xl font-bold leading-tight mb-8 drop-shadow-md">
                Bring nature <br /> into your home
              </h3>
              <button className="bg-[#3BB77E] hover:bg-[#2e9163] text-white px-5 py-2.5 rounded-md w-fit text-sm font-bold transition-all active:scale-95 shadow-lg">
                Shop Now
              </button>
            </div>
          </div>

          {/* Product Items */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse border border-gray-100 rounded-2xl p-4 h-[450px] bg-gray-50"
                  />
                ))
              : bestSellers.map((product: any) => {
                  const imageUrl = product.images?.[0]?.image;
                  const soldCount = product.soldCount || 0;
                  const totalStock = product.totalStock || 1;
                  const progress = (soldCount / totalStock) * 100;

                  return (
                    <div
                      key={product.id}
                      className="border border-gray-100 rounded-2xl p-4 flex flex-col group hover:border-[#3BB77E] hover:shadow-lg transition-all relative bg-white h-full"
                    >
                      {product.isHotDeal && (
                        <span className="absolute top-0 left-0 bg-[#FD6E6E] text-white text-[10px] px-4 py-1.5 rounded-tl-2xl rounded-br-2xl font-bold z-10">
                          Hot
                        </span>
                      )}

                      <div className="h-44 flex items-center justify-center mb-4 mt-6 overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.title}
                            width={160}
                            height={160}
                            className="object-contain group-hover:scale-105 transition-transform duration-700"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="bg-gray-100 w-full h-full rounded-lg" />
                        )}
                      </div>

                      <div className="flex flex-col flex-grow">
                        <span className="text-gray-400 text-[11px] mb-1">
                          {product.category?.name || "General"}
                        </span>
                        <h4 className="text-[#253D4E] font-bold text-[14px] mb-2 line-clamp-2 leading-tight h-10">
                          {product.title}
                        </h4>

                        <div className="flex items-center gap-1 mb-3">
                          <Star
                            size={12}
                            className="fill-[#FDC040] text-[#FDC040]"
                          />
                          <span className="text-gray-400 text-xs">(4.0)</span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-4">
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
                        <div className="mt-auto">
                          <div className="w-full bg-gray-100 h-1.5 rounded-full mb-1">
                            <div
                              className="bg-[#3BB77E] h-full rounded-full transition-all duration-1000"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <p className="text-gray-500 text-[11px] mb-4 font-medium">
                            Sold: {soldCount}/{totalStock}
                          </p>
                          {/* ATTACHED ADD TO CART HANDLER HERE */}
                          <button 
                            onClick={() => addToCart(product)}
                            className="w-full bg-[#3BB77E] hover:bg-[#2e9163] text-white py-2.5 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
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