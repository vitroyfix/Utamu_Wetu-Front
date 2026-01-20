"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_POPULAR_PRODUCTS } from "../../lib/queries";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export default function CategoryBanner() {
  const { data, loading, error } = useQuery(GET_POPULAR_PRODUCTS, {
    fetchPolicy: "network-only",
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Debugging: Watch your terminal/browser console for this
  console.log("Current Products Data:", data?.popularProducts);

  if (!mounted) return null;
  if (loading)
    return (
      <div className="p-10 text-center animate-pulse">
        Loading categories...
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-red-500 text-center">
        Error loading banner data.
      </div>
    );

  const products = data?.popularProducts || [];

  // Grouping products into 4 categories only if data exists
  const collections =
    products.length > 0
      ? [
          { title: "Top Selling", items: products.slice(0, 3) },
          { title: "Trending Products", items: products.slice(3, 6) },
          { title: "Recently added", items: products.slice(6, 9) },
          { title: "Top Rated", items: products.slice(9, 12) },
        ]
      : [];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {collections.map((col, idx) => (
              <div key={idx} className="flex flex-col gap-6">
                {/* Column Header */}
                <div className="relative mb-2">
                  <h3 className="text-[#253D4E] text-xl font-bold pb-4 border-b border-gray-100">
                    {col.title}
                  </h3>
                  <div className="absolute bottom-0 left-0 w-20 h-[2px] bg-[#3BB77E]"></div>
                </div>

                {/* Vertical Product List */}
                <div className="flex flex-col gap-6">
                  {col.items.map((product: any) => (
                    <Link
                      href={`/product/${product.id}`}
                      key={product.id}
                      className="flex items-center gap-4 group"
                    >
                      {/* Image Box - Fixed with sizes prop */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-[#F4F6FA] rounded-xl overflow-hidden">
                        <Image
                          src={product.images[0]?.image || "/placeholder.png"}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                          unoptimized={true}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex flex-col gap-1">
                        <h4 className="text-[#253D4E] font-bold text-sm leading-tight group-hover:text-[#3BB77E] transition-colors line-clamp-2">
                          {product.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-400">(4.0)</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[#3BB77E] font-bold">
                            ${product.price}
                          </span>
                          {product.oldPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ${product.oldPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No products found. Add products in Django Admin to see them here.
          </div>
        )}
      </div>
    </section>
  );
}
