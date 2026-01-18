import { Star, ShoppingCart } from "lucide-react";

export function DailyBestSells() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[#253D4E] text-3xl font-bold">
            Daily Best Sells
          </h2>
          <div className="flex gap-4 text-sm font-bold text-[#253D4E]">
            {["Featured", "Popular", "New added"].map((tab) => (
              <button key={tab} className="hover:text-[#3BB77E]">
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Banner Card */}
          <div className="lg:col-span-1 rounded-2xl bg-[url('/best-sell-banner.jpg')] bg-cover bg-center p-8 flex flex-col justify-start min-h-[400px] relative overflow-hidden group">
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
            <div className="border border-gray-100 rounded-2xl p-4 flex flex-col group hover:shadow-lg transition-all relative">
              <span className="bg-[#3BB77E] text-white text-[10px] px-3 py-1 rounded-tl-2xl rounded-br-2xl w-fit absolute -ml-4 -mt-4">
                Badge
              </span>
              <div className="h-40 flex items-center justify-center mb-4 mt-6">
                <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />
              </div>
              <div className="mt-auto">
                <span className="text-gray-400 text-xs">Brand Name</span>
                <h4 className="text-[#253D4E] font-bold text-sm mb-2 line-clamp-2">
                  Product Title Placeholder
                </h4>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={12} className="fill-[#FDC040] text-[#FDC040]" />
                  <span className="text-gray-400 text-xs">(0.0)</span>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-[#3BB77E] font-bold text-lg">
                    $0.00
                  </span>
                  <span className="text-gray-400 text-xs line-through">
                    $0.00
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 h-1.5 rounded-full mb-1">
                  <div className="bg-[#3BB77E] h-full rounded-full w-[0%]"></div>
                </div>
                <p className="text-gray-500 text-[11px] mb-4">Sold: 0/0</p>
                <button className="w-full bg-[#3BB77E] text-white py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2">
                  <ShoppingCart size={16} /> Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
