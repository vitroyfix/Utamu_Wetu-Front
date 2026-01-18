import { Send } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-[#f8f9fa] py-10 md:py-16 lg:py-28 overflow-hidden min-h-[650px] sm:min-h-[600px] md:min-h-[500px] flex items-center">
      {/* --- Background Decorative Icons --- */}
      <div className="hidden sm:block absolute top-10 left-10 opacity-20 rotate-12">
        <img src="bananas.png" alt="bananas" className="w-12 h-12" />
      </div>
      <div className="absolute bottom-20 left-[5%] md:left-[15%] opacity-20 -rotate-12">
        <img src="lemon.png" alt="lemon" className="w-8 h-8 md:w-12 md:h-12" />
      </div>

      {/* --- Main Content --- */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl text-left">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#FF6262] font-bold text-sm md:text-lg">100%</span>
            <span className="text-gray-600 font-semibold text-sm md:text-lg">Organic Vegetables</span>
          </div>

          <h1 className="text-3xl xs:text-4xl md:text-6xl lg:text-[72px] font-extrabold text-[#253D4E] leading-[1.2] md:leading-[1.1] mb-6">
            The best way to <br className="hidden xs:block" />
            <span className="text-[#3BB77E]">stuff your wallet.</span>
          </h1>

          <p className="text-gray-500 text-sm md:text-base lg:text-lg mb-8 md:mb-10 max-w-[280px] xs:max-w-md lg:max-w-lg leading-relaxed">
            Utamu Wetu brings fresh, organic groceries directly to your doorstep. Experience the treasure of tastes.
          </p>

          {/* Subscription Bar */}
          <div className="flex items-center w-full max-w-[300px] xs:max-w-[340px] md:max-w-[450px] bg-white rounded-full border border-gray-100 shadow-md transition-all">
            <div className="flex items-center flex-grow pl-3 md:pl-5 gap-2 md:gap-3">
              <Send size={14} className="text-gray-400 rotate-45 md:w-[18px] md:h-[18px]" /> 
              <input
                type="email"
                placeholder="Your email address"
                className="w-full py-3 md:py-5 outline-none text-[10px] xs:text-xs md:text-sm text-gray-600 bg-transparent"
              />
            </div>
            <button className="bg-[#3BB77E] hover:bg-[#2e9163] text-white px-4 xs:px-6 md:px-12 py-2.5 md:py-4 rounded-full font-semibold text-[10px] xs:text-xs md:text-base transition-all shrink-0 m-1">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* 5. Spinach Image */}
      <div className="absolute bottom-0 right-0 w-[60%] xs:w-[50%] sm:w-[45%] md:w-[550px] lg:w-[700px] xl:w-[800px] opacity-100 pointer-events-none z-0 translate-y-8">
        <img
          src="/cabbage-image.png"
          alt="Fresh Vegetables"
          className="w-full h-auto object-contain object-right-bottom"
        />
      </div>
    </section>
  );
}