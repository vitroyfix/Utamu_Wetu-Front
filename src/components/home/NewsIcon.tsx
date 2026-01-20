"use client";
import React from "react";
import { Send, Tag, Truck, Headphones, RotateCcw, Box } from "lucide-react";
import Link from "next/link";

const features = [
  { 
    icon: <Tag />, 
    title: "Best prices & offers", 
    desc: "Orders KES 5,000 or more", 
    link: "/shop?filter=best-offers" 
  },
  { 
    icon: <Truck />, 
    title: "Free delivery", 
    desc: "24/7 amazing services", 
    link: "/shipping" 
  },
  { 
    icon: <Headphones />, 
    title: "Great daily deal", 
    desc: "When you sign up", 
    link: "/deals" 
  },
  { 
    icon: <Box />, 
    title: "Wide assortment", 
    desc: "Mega Discounts", 
    link: "/categories" 
  },
  { 
    icon: <RotateCcw />, 
    title: "Easy returns", 
    desc: "Within 30 days", 
    link: "/returns" 
  },
];

export default function NewsIcon() {
  return (
    <div className="bg-white space-y-12 pb-16">
      <section className="container mx-auto px-4">
        <div className="relative bg-[#D0F3E2] rounded-3xl overflow-hidden py-16 px-8 md:px-16 min-h-[500px] md:min-h-[400px] flex items-center">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-[#253D4E] text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
              Stay home & get your daily <br className="hidden sm:block" />
              needs from our shop
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              Start Your Daily Shopping with{" "}
              <span className="text-[#3BB77E]">Utamu Wetu</span>
            </p>

            {/* Subscription Pill */}
            <div className="flex items-center w-full max-w-[450px] bg-white rounded-full shadow-md overflow-hidden">
              <div className="flex items-center flex-grow pl-5 gap-3">
                <Send size={18} className="text-gray-400 rotate-45" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full py-4 outline-none text-sm text-gray-600 bg-transparent"
                />
              </div>
              <button className="bg-[#FD6E6E] hover:bg-[#e65a5a] text-white px-8 md:px-12 py-4 font-bold text-sm md:text-base transition-all active:scale-95 rounded-full">
                Subscribe
              </button>
            </div>
          </div>

          <div
            className="absolute bottom-0 right-0 
            w-[85%] sm:w-[60%] md:w-[500px]      /* Increased width for mobile */
            z-0 pointer-events-none 
            opacity-30 md:opacity-100           /* Lower opacity on mobile for readability */
            transition-all duration-500"
          >
            <img
              src="/deliveryman.png"
              alt="Delivery Service"
              className="w-full h-[400px] md:h-[500px] /* Increased mobile height */
              object-contain object-right-bottom"
            />
          </div>
        </div>
      </section>

      {/* --- Part 2: Feature Trust Icons Row --- */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((feature, index) => (
            <Link href={feature.link} key={index} className="block">
              <div
                className="bg-[#F4F6FA] p-6 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer h-full"
              >
                <div className="text-[#3BB77E] shrink-0">
                  {React.cloneElement(feature.icon as React.ReactElement, {
                    size: 36,
                    strokeWidth: 1.5,
                  })}
                </div>
                <div>
                  <h4 className="text-[#253D4E] font-bold text-sm md:text-base leading-tight">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-xs md:text-sm">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}