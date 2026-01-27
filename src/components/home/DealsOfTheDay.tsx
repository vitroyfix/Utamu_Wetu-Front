"use client";
import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { GET_DEALS_OF_THE_DAY } from "../../lib/queries";
import Image from "next/image";

export function DealsOfTheDay() {
  const { data, loading, error } = useQuery(GET_DEALS_OF_THE_DAY);

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

  if (error) return null;

  const deals = data?.dealsOfTheDay || [];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-[#253D4E] text-2xl md:text-3xl font-bold mb-8">
          Deals Of The Day
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse border border-gray-100 rounded-2xl h-[480px] bg-gray-50"
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
                    className="border border-gray-100 rounded-2xl p-4 relative group hover:border-[#3BB77E] hover:shadow-lg transition-all flex flex-col bg-white h-full min-h-[480px]"
                  >
                    {/* Badge */}
                    <span className="absolute top-0 left-0 bg-[#FD6E6E] text-white text-[10px] px-4 py-1.5 rounded-tl-2xl rounded-br-2xl font-bold z-10">
                      Hot Deal
                    </span>

                    {/* Image Section */}
                    <div className="h-56 flex items-center justify-center mb-4 mt-2 overflow-hidden bg-white rounded-lg relative">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          width={200}
                          height={200}
                          className="object-contain group-hover:scale-105 transition-transform duration-700"
                          unoptimized={true}
                        />
                      ) : (
                        <div className="bg-gray-100 w-full h-full rounded-lg flex items-center justify-center text-gray-300">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow">
                      <span className="text-gray-400 text-[11px] mb-1">
                        {product.category?.name || "General"}
                      </span>

                      <h3 className="text-[#253D4E] font-bold text-[14px] leading-tight mb-2 h-10 line-clamp-2">
                        {product.title}
                      </h3>

                      <div className="flex items-center gap-1 mb-1">
                        <Star
                          size={12}
                          className="fill-[#FDC040] text-[#FDC040]"
                        />
                        <span className="text-gray-400 text-xs">(4.0)</span>
                      </div>

                      <div className="text-xs mb-3">
                        <span className="text-gray-400">By </span>
                        <span className="text-[#3BB77E] hover:underline cursor-pointer font-medium">
                          {product.brand?.name || "Utamu Wetu"}
                        </span>
                      </div>

                      {/* 3. Progress Bar - Now using Real Data */}
                      <div className="mb-4">
                        <div className="w-full bg-gray-100 h-1.5 rounded-full mb-1">
                          <div
                            className="bg-[#3BB77E] h-full rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-500 text-[10px] font-medium">
                          Sold: {soldCount}/{totalStock}
                        </p>
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
                          className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white px-4 py-2 rounded-md text-sm font-bold flex items-center gap-1 transition-all active:scale-95"
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
