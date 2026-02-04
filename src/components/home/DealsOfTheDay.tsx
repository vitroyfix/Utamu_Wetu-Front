"use client";
import React, { useState } from "react";
import { Star, ShoppingCart, Check } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { GET_DEALS_OF_THE_DAY } from "../../lib/queries";
import Image from "next/image";
import Link from "next/link"; 

export function DealsOfTheDay() {
  const { data, loading, error } = useQuery(GET_DEALS_OF_THE_DAY);
  // State to track which item was just added
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

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

    // Visual feedback logic
    setAddedItemId(product.id);
    setTimeout(() => setAddedItemId(null), 2000);
  };

  if (error) return null;

  // FIX: Applied 'as any' cast to data to allow property access during production build
  // PRIORITY LOGIC: Sort deals by soldCount descending so top sellers appear first
  const deals = (data as any)?.dealsOfTheDay 
    ? [...(data as any).dealsOfTheDay].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)) 
    : [];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-[#253D4E] text-2xl md:text-3xl font-bold mb-8">
          Deals Of The Day
        </h2>

        {/* Responsive Grid: Responsive columns for Desktop and horizontal scroll for Mobile */}
        <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:overflow-visible">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[280px] animate-pulse border border-gray-100 rounded-[2rem] h-[500px] bg-gray-50"
                />
              ))
            : deals.map((product: any) => {
                const imageUrl = product.images?.[0]?.image;
                const soldCount = product.soldCount || 0;
                const totalStock = product.totalStock || 1;
                const progress = (soldCount / totalStock) * 100;

                return (
                  <div
                    key={product.id}
                    className="min-w-[280px] md:min-w-0 snap-start border border-gray-100 rounded-[2rem] p-4 relative group hover:border-[#3BB77E] hover:shadow-xl transition-all flex flex-col bg-white h-full min-h-[480px] md:min-h-[520px]"
                  >
                    {/* Badge */}
                    <span className="absolute top-0 left-0 bg-[#FD6E6E] text-white text-[10px] px-4 py-1.5 rounded-tl-[2rem] rounded-br-2xl font-bold z-10">
                      Hot Deal
                    </span>

                    {/* Image Section - Wrapped in Link for navigation */}
                    <Link href={`/product/${product.slug}`} className="cursor-pointer">
                      <div className="relative w-full h-52 md:h-64 mb-4 mt-2 overflow-hidden rounded-2xl bg-[#f9fbfb]">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-300 font-bold uppercase text-[10px]">
                            No Image
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex flex-col flex-grow px-2">
                      <span className="text-gray-400 text-[11px] mb-1 font-bold uppercase tracking-wider">
                        {product.category?.name || "General"}
                      </span>

                      {/* Product Title - Wrapped in Link for navigation */}
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="text-[#253D4E] font-bold text-[15px] leading-tight mb-2 h-10 line-clamp-2 hover:text-[#3BB77E] transition-colors cursor-pointer">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1 mb-2">
                        <Star
                          size={12}
                          className="fill-[#FDC040] text-[#FDC040]"
                        />
                        <span className="text-gray-400 text-xs font-medium">(4.0)</span>
                      </div>

                      <div className="text-xs mb-4">
                        <span className="text-gray-400">By </span>
                        <span className="text-[#3BB77E] hover:underline cursor-pointer font-bold">
                          {product.brand?.name || "Utamu Wetu"}
                        </span>
                      </div>

                      {/* Progress Bar using Backend Data */}
                      <div className="mb-4">
                        <div className="w-full bg-gray-100 h-2 rounded-full mb-1 overflow-hidden">
                          <div
                            className="bg-[#3BB77E] h-full rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-500 text-[10px] font-bold">
                          Sold: {soldCount}/{totalStock}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                        <div className="flex flex-col">
                          <span className="text-[#3BB77E] font-black text-lg">
                            KES {parseFloat(product.price).toLocaleString()}
                          </span>
                          {product.oldPrice && (
                            <span className="text-gray-400 text-[11px] line-through font-bold">
                              KES {parseFloat(product.oldPrice).toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => addToCart(product)}
                          className={`${
                            addedItemId === product.id 
                            ? "bg-orange-500 text-white shadow-orange-200" 
                            : "bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white"
                          } px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-90 shadow-sm`}
                        >
                          {addedItemId === product.id ? (
                            <>
                              <Check size={16} className="animate-in zoom-in" /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={16} /> Add
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