"use client";
import React, { useState, useEffect } from "react";
import { Star, ShoppingCart, Check, Clock } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client"; 
import Image from "next/image";
import Link from "next/link"; 

// 1. Updated query to use the new backend field
const GET_DAILY_BEST_SELLS = gql`
  query GetDailyBestSells {
    dailyBestSells {
      id
      title
      slug
      price
      oldPrice
      soldCount
      totalStock
      isHotDeal
      isBestSeller
      category { name }
      images {
        image
      }
    }
  }
`;

export function DailyBestSells() {
  const [activeTab, setActiveTab] = useState("Featured");
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  
  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, mins: 0, secs: 0
  });

  useEffect(() => {
    const target = new Date();
    target.setHours(23, 59, 59, 999); 

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Swapped to the new query
  const { data, loading, error } = useQuery(GET_DAILY_BEST_SELLS);
  
  const addToCart = (product: any) => {
    const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].qty += 1;
    } else {
      currentCart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));

    setAddedItemId(product.id);
    setTimeout(() => setAddedItemId(null), 2000);
  };

  if (error) return null;

  // FIX: Applied 'as any' cast to data to allow property access during production build
  const allBestSells = (data as any)?.dailyBestSells || [];

  const getFilteredBestSells = () => {
    let filtered = [...allBestSells];
    if (activeTab === "Featured") {
      filtered = filtered.filter((p: any) => p.isHotDeal);
    } else if (activeTab === "Popular") {
      filtered = filtered.sort((a: any, b: any) => (b.soldCount || 0) - (a.soldCount || 0));
    } else if (activeTab === "New added") {
      filtered = filtered.reverse(); 
    }
    return filtered.slice(0, 4);
  };

  const displayProducts = getFilteredBestSells();

  const CategoryNav = ({ className }: { className?: string }) => (
    <div className={`flex gap-6 text-sm font-bold text-[#253D4E] overflow-x-auto no-scrollbar pb-2 ${className}`}>
      {["Featured", "Popular", "New added"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`transition-all duration-300 whitespace-nowrap pb-1 ${
            activeTab === tab ? "text-[#3BB77E] border-b-2 border-[#3BB77E]" : "hover:text-[#3BB77E]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-[#253D4E] text-2xl md:text-3xl font-bold">
            Daily Best Sells
          </h2>
          <CategoryNav className="hidden lg:flex" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="rounded-3xl bg-[url('/best-sell-banner.jpg')] bg-cover bg-center p-8 flex flex-col justify-between min-h-[400px] lg:min-h-[520px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
              <div className="relative z-10">
                <h3 className="text-white text-3xl font-black leading-tight mb-4">
                  Freshly <br /> Harvested <br /> For You
                </h3>
                
                <div className="flex gap-2 mt-6">
                  {[
                    { label: 'Hrs', val: timeLeft.hours },
                    { label: 'Min', val: timeLeft.mins },
                    { label: 'Sec', val: timeLeft.secs }
                  ].map((unit, i) => (
                    <div key={i} className="bg-white/20 backdrop-blur-md rounded-lg p-2 min-w-[50px] text-center border border-white/30">
                      <p className="text-white font-black text-lg leading-none">{unit.val < 10 ? `0${unit.val}` : unit.val}</p>
                      <p className="text-white/80 text-[8px] uppercase font-bold mt-1">{unit.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10">
                <button className="bg-[#3BB77E] text-white w-full py-4 rounded-2xl text-sm font-black shadow-xl hover:bg-[#253D4E] transition-all flex items-center justify-center gap-2">
                  Explore More <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <CategoryNav className="lg:hidden" />
          </div>

          <div className="lg:col-span-4 flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory no-scrollbar sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 md:overflow-visible md:pb-0">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="min-w-[260px] animate-pulse border border-gray-100 rounded-[2rem] p-6 h-[480px] bg-gray-50" />
                ))
              : displayProducts.map((product: any) => {
                  const imageUrl = product.images?.[0]?.image;
                  const progress = ((product.soldCount || 0) / (product.totalStock || 100)) * 100;

                  return (
                    <div key={product.id} className="min-w-[260px] sm:min-w-0 snap-start border border-gray-100 rounded-[2rem] p-5 md:p-6 flex flex-col group hover:border-[#3BB77E] hover:shadow-2xl transition-all bg-white relative">
                      <Link href={`/product/${product.slug}`} className="cursor-pointer">
                        <div className="relative h-48 md:h-52 w-full mb-6 mt-4 overflow-hidden rounded-2xl bg-[#f9fbfb]">
                          <Image
                            src={imageUrl || "/placeholder.webp"}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                        </div>
                      </Link>

                      <div className="flex flex-col flex-grow">
                        <span className="text-[#3BB77E] text-[10px] font-black uppercase tracking-widest mb-2">{product.category?.name}</span>
                        
                        <Link href={`/product/${product.slug}`}>
                          <h4 className="text-[#253D4E] font-bold text-[13px] md:text-sm mb-3 line-clamp-2 h-10 hover:text-[#3BB77E] transition-colors cursor-pointer">
                            {product.title}
                          </h4>
                        </Link>

                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < 4 ? "#FDC040" : "none"} className={i < 4 ? "text-[#FDC040]" : "text-gray-200"} />
                          ))}
                        </div>

                        <div className="mb-4">
                          <span className="text-[#3BB77E] font-black text-lg md:text-xl">KES {parseFloat(product.price).toLocaleString()}</span>
                        </div>

                        <div className="mt-auto space-y-4">
                          <div className="space-y-1">
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#3BB77E] h-full rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                            <p className="text-gray-400 text-[9px] md:text-[10px] font-bold">Sold: {product.soldCount}/{product.totalStock}</p>
                          </div>
                          <button 
                            onClick={() => addToCart(product)}
                            className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                              addedItemId === product.id 
                                ? "bg-orange-500 text-white shadow-orange-200" 
                                : "bg-[#3BB77E] hover:bg-[#253D4E] text-white shadow-[#3BB77E]/20"
                            }`}
                          >
                            {addedItemId === product.id ? <><Check size={16} /> Added!</> : <><ShoppingCart size={16} /> Add To Cart</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

function ArrowRight({ size, className }: { size?: number, className?: string }) {
  return (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14m-7-7 7 7-7 7"/>
    </svg>
  );
}