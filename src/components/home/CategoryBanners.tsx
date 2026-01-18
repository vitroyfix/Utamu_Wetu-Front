import { ArrowRight } from "lucide-react";

export default function CategoryBanners() {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[#F0E8D5] rounded-2xl p-6 md:p-8 relative overflow-hidden min-h-[220px] md:h-[240px] flex flex-col justify-center group cursor-pointer shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105 pointer-events-none z-0">
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            </div>

            <div className="relative z-10 max-w-[75%] sm:max-w-[65%] bg-white/20 backdrop-blur-[4px] rounded-xl p-3 md:p-4 border border-white/30">
              <h3 className="text-[#253D4E] font-bold text-lg md:text-xl mb-3 md:mb-4 leading-tight">
                Banner Title Placeholder
              </h3>
              <button className="bg-[#3BB77E] hover:bg-[#2e9163] text-white px-4 md:px-5 py-2 rounded-md text-[10px] md:text-xs font-bold flex items-center gap-2 transition-all w-fit active:scale-95">
                Shop Now
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
