"use client";

import { useEffect, useState } from "react";
import Hero from "../components/home/Hero";
import CategoryBanners from "../components/home/CategoryBanners";
import PopularProducts from "../components/home/PopularProducts";
import { DailyBestSells } from "../components/home/DailyBestSells";
import { DealsOfTheDay } from "../components/home/DealsOfTheDay";

// New modular imports based on your screenshots
import ProductShowcase from "../components/home/ProductShowcase";
import NewsIcon from "../components/home/NewsIcon";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevents hydration mismatch

  return (
    <>
      {/* 1. Main Banner / Hero Section */}
      <Hero />

      {/* 2. Category Banners (Onions, Juice, etc.) */}
      <ProductShowcase />
       

      {/* 3. Main Product Grid */}
       <PopularProducts /> 

      {/* 4. Promotional Daily Sections */}
       <DailyBestSells/>
       <DealsOfTheDay/>

      {/* 5. Final Footer-area Sections */}
       <CategoryBanners /> 
       <NewsIcon />
    </>
  );
}