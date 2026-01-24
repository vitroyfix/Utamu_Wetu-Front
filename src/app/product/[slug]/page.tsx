"use client";
import React, { useState, use } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT_DETAILS, GET_POPULAR_PRODUCTS } from "../../../lib/queries";
import {
  ShoppingCart,
  Star,
  Leaf,
  Truck,
  AlertTriangle,
  CheckCircle,
  ThermometerSnowflake,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  User,
} from "lucide-react";
import Image from "next/image";
import ProductSidebar from "../../../components/product/ProductSidebar";

// Sub-component for the imminent results grid
function PopularProductsGrid({ filters }: { filters: any }) {
  const { data, loading } = useQuery(GET_POPULAR_PRODUCTS, {
    variables: {
      categoryName: filters.category,
      tagName: filters.tag,
      minPrice: 0,
      maxPrice: filters.maxPrice,
    },
  });

  const products = data?.popularProducts || [];

  return (
    <div className="mt-16 pt-10 border-t border-gray-100">
      <h2 className="text-[#253D4E] text-2xl font-bold mb-8 flex items-center gap-3">
         <span className="w-1.5 h-6 bg-[#3BB77E] rounded-full" />
         Popular {filters.category ? `in ${filters.category}` : "Products"}
      </h2>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="h-72 bg-gray-50 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item: any) => (
            <div key={item.id} className="border border-gray-100 rounded-2xl p-4 bg-white hover:border-[#3BB77E] hover:shadow-lg transition-all group">
              <div className="relative aspect-square mb-4 bg-[#F8F8F8] rounded-xl overflow-hidden">
                <Image src={item.images[0]?.image} alt={item.title} fill className="object-contain p-4 group-hover:scale-110 transition-transform" unoptimized />
              </div>
              <h3 className="text-[#253D4E] font-bold text-sm line-clamp-2 mb-2 h-10">{item.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-[#3BB77E] font-bold">KES {parseFloat(item.price).toLocaleString()}</span>
                <button className="bg-[#def9ec] text-[#3BB77E] p-2 rounded-lg hover:bg-[#3BB77E] hover:text-white transition-colors">
                  <ShoppingCart size={16}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && products.length === 0 && (
        <p className="text-center text-gray-400 italic py-10 bg-gray-50 rounded-2xl">No matches found for your current selection.</p>
      )}
    </div>
  );
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [filters, setFilters] = useState({ category: null, weight: null, tag: null, maxPrice: 5000 });

  const { data, loading, error } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { slug },
    skip: !slug,
  });

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse text-[#3BB77E] font-bold">
        Loading Fresh Products...
      </div>
    );
  if (error || !data?.productBySlug)
    return (
      <div className="p-10 text-center font-bold text-[#253D4E]">
        Product not found.
      </div>
    );

  const product = data.productBySlug;
  const galleryImages = product.images || [];
  const nutritionText = product.nutritionalInfo || "";

  const increment = () =>
    quantity < (product.maxOrder || 12) && setQuantity((prev) => prev + 1);
  const decrement = () => quantity > 1 && setQuantity((prev) => prev - 1);

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#3BB77E] py-6 mb-8">
        <div className="container mx-auto px-4 text-center md:text-left">
          <nav className="text-white/80 text-[11px] font-medium flex items-center justify-center md:justify-start gap-2">
            Home <span>/</span> {product.category?.name} <span>/</span>{" "}
            <span className="text-white font-bold">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-1/4 shrink-0">
            <ProductSidebar onFilterChange={(newFilters: any) => setFilters(newFilters)} />
          </div>

          <div className="flex-1 border border-[#3BB77E]/20 rounded-2xl p-4 md:p-8 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-12">
              <div className="space-y-4">
                <div className="border border-gray-100 rounded-xl overflow-hidden p-4 bg-white flex items-center justify-center aspect-square md:h-[450px]">
                  {galleryImages[selectedImage] && (
                    <Image
                      src={galleryImages[selectedImage].image}
                      alt={product.title}
                      width={600}
                      height={600}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {galleryImages.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 border rounded-lg overflow-hidden shrink-0 transition-all ${selectedImage === idx ? "border-[#3BB77E]" : "border-gray-100 opacity-60"}`}
                    >
                      <Image
                        src={img.image}
                        alt="Thumb"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[#253D4E] text-2xl md:text-3xl font-bold mb-3">
                  {product.title}
                </h1>
                <div className="flex items-center gap-2 mb-6 text-[#FDC040]">
                  <div className="flex font-bold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-gray-400 text-xs ml-2">
                    ( 75 Reviews )
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-8 border-b border-gray-100 pb-6">
                  <p className="flex gap-2">
                    <span className="font-bold text-gray-700 min-w-[100px]">Brand:</span>{" "}
                    <span className="text-gray-500">{product.brand?.name}</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="font-bold text-gray-700 min-w-[100px]">Weight:</span>{" "}
                    <span className="text-gray-500">{product.weight?.value} {product.weight?.unit}</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="font-bold text-gray-700 min-w-[100px]">Product SKU:</span>{" "}
                    <span className="text-gray-500 font-mono uppercase">{product.sku}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[#3BB77E] text-4xl font-bold">KES {parseFloat(product.price).toLocaleString()}</span>
                  {product.oldPrice && (<span className="text-gray-300 line-through text-xl italic">KES {parseFloat(product.oldPrice).toLocaleString()}</span>)}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-md h-12 overflow-hidden bg-white shadow-sm">
                    <button onClick={decrement} className="w-10 h-full hover:bg-gray-50 text-gray-400 transition-colors">−</button>
                    <input type="number" value={quantity} readOnly className="w-12 text-center font-bold text-sm text-[#253D4E] outline-none appearance-none m-0 bg-transparent " style={{ WebkitAppearance: "none", MozAppearance: "textfield" }} />
                    <button onClick={increment} className="w-10 h-full hover:bg-gray-50 text-gray-400 transition-colors">+</button>
                  </div>
                  <button className="flex-1 bg-[#3BB77E] hover:bg-[#2e9163] text-white px-10 h-12 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#3BB77E]/20">
                    <ShoppingCart size={18} /> Add To Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <section className="animate-in fade-in duration-500">
                <h4 className="text-[#253D4E] font-bold text-xl mb-6 underline decoration-[#3BB77E] underline-offset-8">
                  1. Product Overview
                </h4>
                <p className="text-gray-600 mb-6 leading-7 text-sm max-w-4xl">
                  {product.description}.
                </p>

                {!isExpanded && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center gap-2 text-[#3BB77E] font-bold text-sm hover:underline"
                  >
                    Read Full Technical Specs <ChevronDown size={16} />
                  </button>
                )}
              </section>

              {isExpanded && (
                <div className="space-y-16 pt-8 border-t border-gray-100 animate-in slide-in-from-top-4 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
                    <div className="space-y-4">
                      <h5 className="font-bold text-[#253D4E] uppercase text-xs tracking-widest flex items-center gap-2 font-bold">
                        <Info size={14} /> Product Identity
                      </h5>
                      <p><span className="text-gray-400 font-bold mr-2">SKU:</span>{product.sku}</p>
                      <p><span className="text-gray-400 font-bold mr-2">Barcode:</span>{product.barcode}</p>
                      <p><span className="text-gray-400 font-bold mr-2">Type:</span>{product.productType}</p>
                    </div>
                    <div className="space-y-4">
                      <h5 className="font-bold text-[#253D4E] uppercase text-xs tracking-widest flex items-center gap-2 font-bold">
                        <Truck size={14} /> Commercial Information
                      </h5>
                      <p><span className="text-gray-400 font-bold mr-2">Packaging:</span>{product.packagingType}</p>
                      <p><span className="text-gray-400 font-bold mr-2">Max Order:</span>{Math.floor(product.maxOrder / 12)} Dozen to be delivered</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h5 className="font-bold text-[#253D4E] uppercase text-xs tracking-widest flex items-center gap-2 font-bold">
                      <Leaf size={14} /> Nutritional Content
                    </h5>
                    <p className="text-gray-600 italic leading-relaxed text-sm">Ingredients: {product.ingredients}.</p>
                    <div className="border-y border-gray-50 py-10">
                      <p className="text-[#3BB77E] font-medium text-base leading-relaxed whitespace-pre-wrap">{nutritionText || "Nutritional information pending batch laboratory verification."}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
                    <div className="space-y-4">
                      <h5 className="font-bold text-[#253D4E] uppercase text-xs tracking-widest flex items-center gap-2"><ShieldCheck size={14} /> Manufacturing</h5>
                      <p><span className="text-gray-400 font-bold">Manufacturer:</span> {product.manufacturer}</p>
                      <p><span className="text-gray-400 font-bold">Origin:</span> Made in {product.countryOfOrigin}</p>
                    </div>
                    <div className="space-y-4">
                      <h5 className="font-bold text-[#253D4E] uppercase text-xs tracking-widest flex items-center gap-2"><ThermometerSnowflake size={14} /> Storage</h5>
                      <p className="text-gray-600 leading-relaxed italic">{product.storageInstructions}</p>
                    </div>
                    <div className="space-y-4">
                      <h5 className="font-bold text-[#253D4E] uppercase text-xs tracking-widest flex items-center gap-2"><Truck size={14} /> Delivery</h5>
                      <p className="text-blue-600 font-bold flex items-center gap-1">
                        {product.requiresColdTransport && <Truck size={14} />}{" "}
                        {product.requiresColdTransport ? "Requires cold transport" : "Standard shipping"}
                      </p>
                    </div>
                  </div>
                  <div className="p-8 bg-red-50 border-2 border-red-100 rounded-[2rem] shadow-inner mt-12">
                    <h5 className="text-red-700 font-black uppercase text-xs tracking-[0.2em] mb-4 flex items-center gap-2">
                      <AlertTriangle size={18} className="animate-pulse" /> 9. Allergens & Safety Warnings
                    </h5>
                    <div className="space-y-4">
                      <p className="text-red-700 font-bold text-base leading-relaxed">
                        Contains:{" "}
                        <span className="underline decoration-red-300 underline-offset-4">
                          {product.allergens || "No known allergens reported for this batch."}
                        </span>
                      </p>
                      <p className="text-red-600/80 text-sm italic">
                        Safety Advisory: Not suitable for individuals with sensitivity to mentioned ingredients. Keep out of direct sunlight and follow storage instructions for shelf stability.
                      </p>
                    </div>
                  </div>

                  <button onClick={() => setIsExpanded(false)} className="flex items-center gap-2 text-[#3BB77E] font-bold text-sm hover:underline mt-8">
                    Show Less Information <ChevronUp size={16} />
                  </button>
                </div>
              )}

              {/* Verified Reviews Section */}
              <div className="pt-20 border-t border-gray-100">
                <h4 className="text-[#253D4E] font-bold text-xl mb-10 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-[#3BB77E] rounded-full" />
                  Verified Customer Feedback
                </h4>

                <div className="space-y-8 max-w-5xl">
                  <div className="flex gap-4 p-8 bg-[#F9FBFA] rounded-[2rem] border border-[#3BB77E]/5 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-[#3BB77E] text-white flex items-center justify-center font-black text-xl shrink-0">PW</div>
                    <div className="space-y-3 flex-1">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <h5 className="text-[#253D4E] font-bold text-base flex items-center gap-2 leading-none">Peter Wangimwa <CheckCircle size={14} className="text-[#3BB77E] fill-[#3BB77E]/10" /></h5>
                        <div className="flex text-[#FDC040]">
                          {[...Array(5)].map((_, i) => (<Star key={i} size={14} fill="currentColor" />))}
                        </div>
                      </div>
                      <p className="text-gray-600 italic text-sm leading-relaxed border-l-2 border-[#3BB77E]/20 pl-4 py-1">"The technical photos helped me verify the expiration standards. Excellent batch."</p>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-white border-2 border-[#3BB77E]/20 text-[#3BB77E] font-bold rounded-2xl transition-all text-xs uppercase tracking-widest shadow-sm flex items-center justify-center gap-2">
                    <User size={16} /> Write Your Review
                  </button>
                </div>
              </div>

              {/* DYNAMIC PRODUCT LISTING */}
              <PopularProductsGrid filters={filters} />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}