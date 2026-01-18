import { Star, ShoppingCart } from "lucide-react";

export default function PopularProducts() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* 1. Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-[#253D4E] text-2xl md:text-3xl font-bold">
            Popular Products
          </h2>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <button className="text-sm font-bold transition-colors text-[#3BB77E]">
              All
            </button>
            <button className="text-sm font-bold transition-colors text-[#253D4E] hover:text-[#3BB77E]">
              Category Placeholder
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div className="border border-gray-100 rounded-2xl p-4 relative group hover:border-[#3BB77E] hover:shadow-lg transition-all flex flex-col">
            <span className="absolute top-0 left-0 bg-[#3BB77E] text-white text-[10px] px-4 py-1.5 rounded-tl-2xl rounded-br-2xl font-bold z-10">
              New
            </span>

            <div className="h-44 flex items-center justify-center mb-4 mt-2">
              <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-grow">
              <span className="text-gray-400 text-[11px] mb-1">Category</span>
              <h3 className="text-[#253D4E] font-bold text-[14px] leading-tight mb-2 h-10 line-clamp-2">
                Product Title Placeholder
              </h3>

              {/* Rating & Brand */}
              <div className="flex items-center gap-1 mb-1">
                <Star size={12} className="fill-[#FDC040] text-[#FDC040]" />
                <span className="text-gray-400 text-xs">(0.0)</span>
              </div>
              <div className="text-xs mb-4">
                <span className="text-gray-400">By </span>
                <span className="text-[#3BB77E] hover:underline cursor-pointer">
                  Brand
                </span>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[#3BB77E] font-bold text-lg">
                    $0.00
                  </span>
                  <span className="text-gray-400 text-xs line-through">
                    $0.00
                  </span>
                </div>
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
