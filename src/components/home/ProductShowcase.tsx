import { Star } from "lucide-react";

export default function ProductShowcase() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <div className="mb-8 relative">
              <h3 className="text-[#253D4E] text-xl font-bold pb-4 border-b border-gray-100">
                Column Title
              </h3>
              <div className="absolute bottom-0 left-0 w-20 h-[2px] bg-[#3BB77E]"></div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-24 h-24 bg-[#F4F6FA] rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-lg" />
                </div>

                <div className="flex flex-col">
                  <h4 className="text-[#253D4E] font-bold text-sm leading-tight mb-1 line-clamp-2 hover:text-[#3BB77E] transition-colors">
                    Product Name Placeholder
                  </h4>
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={12} className="fill-[#FDC040] text-[#FDC040]" />
                    <span className="text-gray-400 text-xs">(0.0)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#3BB77E] font-bold text-base">
                      $0.00
                    </span>
                    <span className="text-gray-400 text-xs line-through">
                      $0.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
