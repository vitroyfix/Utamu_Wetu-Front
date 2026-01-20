"use client";
import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";

export function DealsOfTheDay() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-[#253D4E] text-2xl md:text-3xl font-bold mb-8">
          Deals Of The Day
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Main Card Container - Matches PopularProducts exactly */}
          <div className="border border-gray-100 rounded-2xl p-4 relative group hover:border-[#3BB77E] hover:shadow-lg transition-all flex flex-col bg-white h-[450px]">
            
            {/* Badge - Matches the shape/style of PopularProducts */}
            <span className="absolute top-0 left-0 bg-[#FD6E6E] text-white text-[10px] px-4 py-1.5 rounded-tl-2xl rounded-br-2xl font-bold z-10">
              Hot Deal
            </span>

            {/* Image Section - Scaled for 'Deals' but keeps hover effect */}
            <div className="h-64 flex items-center justify-center mb-4 mt-2 overflow-hidden bg-white rounded-lg relative">
              {/* Replace the pulse div with your Next.js Image once you add logic */}
              <div className="w-full h-full bg-gray-50 animate-pulse group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                 <span className="text-gray-300">Product Image</span>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col flex-grow">
              <span className="text-gray-400 text-[11px] mb-1">
                Category Name
              </span>
              
              <h3 className="text-[#253D4E] font-bold text-[14px] leading-tight mb-2 h-10 line-clamp-2">
                Seeds of Change Organic Quinoa, Brown, & Red Rice
              </h3>

              {/* Stats & Brand */}
              <div className="flex items-center gap-1 mb-1">
                <Star size={12} className="fill-[#FDC040] text-[#FDC040]" />
                <span className="text-gray-400 text-xs">(4.0)</span>
              </div>

              <div className="text-xs mb-4">
                <span className="text-gray-400">By </span>
                <span className="text-[#3BB77E] hover:underline cursor-pointer font-medium">
                  Utamu Wetu
                </span>
              </div>

              {/* Price & Cart Action - Matches the bottom alignment of your PopularProducts */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[#3BB77E] font-bold text-lg">
                    KES 500
                  </span>
                  <span className="text-gray-400 text-xs line-through">
                    KES 800
                  </span>
                </div>
                
                {/* Button - Exactly the same as your PopularProducts code */}
                <button className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1 transition-all active:scale-95">
                  <ShoppingCart size={14} />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}