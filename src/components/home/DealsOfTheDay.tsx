"use client";
import { Star, ShoppingCart } from "lucide-react";

export function DealsOfTheDay() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-[#253D4E] text-3xl font-bold mb-8">
          Deals Of The Day
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="relative h-[400px] rounded-3xl overflow-hidden group">
            <div className="w-full h-full bg-gray-200 animate-pulse" />

            {/* Content Box */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-2xl p-5 shadow-xl border border-gray-100 z-10">
              <h4 className="text-[#253D4E] font-bold text-sm mb-2 line-clamp-1">
                Product Title
              </h4>

              <div className="flex items-center gap-1 mb-2">
                <Star size={12} className="fill-[#FDC040] text-[#FDC040]" />
                <span className="text-gray-400 text-xs">(0.0)</span>
              </div>

              <div className="text-xs mb-3">
                <span className="text-gray-400">By </span>
                <span className="text-[#3BB77E] font-semibold">Brand Name</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[#3BB77E] font-bold text-lg">
                    $0.00
                  </span>
                  <span className="text-gray-400 text-xs line-through">
                    $0.00
                  </span>
                </div>

                <button className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white px-4 py-2 rounded-md font-bold text-xs flex items-center gap-1 transition-colors">
                  <ShoppingCart size={14} /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
