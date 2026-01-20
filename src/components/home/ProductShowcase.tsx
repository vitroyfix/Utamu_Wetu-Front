"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react"; 
import { GET_SHOWCASE_ASSETS } from "../../lib/queries";
import Image from "next/image";
import Link from "next/link";

// Swiper components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductShowcase() {
  const { data, loading, error } = useQuery(GET_SHOWCASE_ASSETS, {
    fetchPolicy: "network-only",
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return null;

  if (loading) return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );

  if (error) {
    console.error("GraphQL Error:", error);
    return null; 
  }

  const showcases = data?.allShowcases || [];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 relative">
          <h3 className="text-[#253D4E] text-2xl font-bold pb-4 border-b border-gray-100">
            Featured Collections
          </h3>
          <div className="absolute bottom-0 left-0 w-20 h-[2px] bg-[#3BB77E]"></div>
        </div>

        {showcases.length > 0 ? (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true, // NEW: Stops the carousel on hover
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {showcases.map((item: any) => (
              <SwiperSlide key={item.id}>
                <Link 
                  href={item.linkUrl || "#"} 
                  className="relative h-72 group overflow-hidden rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md bg-gray-50 block"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title || "Showcase"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized={true} 
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <span className="text-gray-400">Image Missing</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                    {item.subtitle && (
                      <p className="text-[#3BB77E] font-bold text-[10px] mb-1 uppercase tracking-widest bg-white/10 backdrop-blur-sm inline-block px-2 py-0.5 rounded">
                        {item.subtitle}
                      </p>
                    )}
                    <h4 className="text-xl font-bold leading-tight mb-2 group-hover:text-[#3BB77E] transition-colors">
                      {item.title}
                    </h4>
                    
                    {/* Visual Button for Shop Now */}
                    <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                      <span className="bg-[#3BB77E] px-4 py-2 rounded-md group-hover:bg-[#2e9163] transition-colors">
                        Shop Now
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="py-10 text-center text-gray-400 italic">
            No active showcases found in Database.
          </div>
        )}
      </div>
    </section>
  );
}