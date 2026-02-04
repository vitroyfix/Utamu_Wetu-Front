"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_POPULAR_PRODUCTS } from "../../lib/queries";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export default function CategoryBanner() {
  // Fetching data with maxPrice filter as requested by your query structure
  const { data, loading, error } = useQuery(GET_POPULAR_PRODUCTS, {
    variables: { maxPrice: 50000 },
    fetchPolicy: "cache-and-network",
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (loading)
    return (
      <div className="p-10 text-center animate-pulse text-[#3BB77E] font-bold">
        Organizing collections...
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-red-500 text-center font-bold">
        Error loading banner data.
      </div>
    );

  const allProducts = data?.popularProducts || [];

  // Grouping logic ensuring each specific section lists relevant products
  const collections =
    allProducts.length > 0
      ? [
          { 
            title: "Top Selling", 
            items: allProducts.filter((p: any) => p.isBestSeller).slice(0, 10) 
          },
          { 
            title: "Trending Products", 
            items: allProducts.filter((p: any) => p.isHotDeal).slice(0, 10) 
          },
          { 
            title: "Recently Added", 
            items: [...allProducts].reverse().slice(0, 10) 
          },
          { 
            title: "Top Rated", 
            items: allProducts.slice(4, 14) 
          },
        ]
      : [];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* MAIN GRID STRUCTURE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {collections.map((col, idx) => (
            <div key={idx} className="flex flex-col gap-5 md:gap-6">
              
              {/* CATEGORY HEADER */}
              <div className="relative mb-1">
                <h3 className="text-[#253D4E] text-[14px] md:text-[16px] font-black pb-3 border-b border-gray-100 uppercase tracking-widest">
                  {col.title}
                </h3>
                <div className="absolute bottom-0 left-0 w-12 h-[2px] bg-[#3BB77E]"></div>
              </div>

              {/* PRODUCT LIST INTERACTION */}
              <div className="flex overflow-x-auto md:flex-col md:max-h-[230px] md:overflow-y-auto gap-4 md:gap-6 pb-4 md:pb-0 snap-x snap-mandatory no-scrollbar">
                {col.items.map((product: any) => (
                  <Link
                    href={`/product/${product.slug}`}
                    key={product.id}
                    className="flex items-center gap-4 group cursor-pointer shrink-0 min-w-[280px] md:min-w-0 snap-start bg-[#f9fbfb] md:bg-transparent p-3 md:p-0 rounded-2xl border border-gray-50 md:border-none shadow-sm md:shadow-none"
                  >
                    {/* Image Box - Updated with object-cover for perfect fit */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100">
                      <Image
                        src={product.images?.[0]?.image || "/placeholder.png"}
                        alt={product.title}
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={true}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-[#253D4E] font-bold text-xs md:text-sm leading-tight group-hover:text-[#3BB77E] transition-colors line-clamp-2">
                        {product.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#FDC040] text-[#FDC040]" />
                        <span className="text-[10px] text-gray-400 font-bold">(4.0)</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#3BB77E] font-black text-sm">
                          KES {parseFloat(product.price).toLocaleString()}
                        </span>
                        {product.oldPrice && (
                          <span className="text-[10px] text-gray-300 line-through italic">
                            KES {parseFloat(product.oldPrice).toLocaleString()}
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