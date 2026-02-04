"use client";
import React, { useState, use, useCallback, useEffect } from "react"; 
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
  Check,
} from "lucide-react";
import Image from "next/image";
import ProductSidebar from "../../../components/product/ProductSidebar";

// Sub-component updated with horizontal mobile scroll and "Added" feedback
function PopularProductsGrid({ filters }: { filters: any }) {
  const { data, loading } = useQuery(GET_POPULAR_PRODUCTS, {
    variables: {
      categoryName: filters.category,
      tagName: filters.tag,
      minPrice: 0,
      maxPrice: filters.maxPrice,
    },
  });

  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  // FIX: Type assertion to allow access to popularProducts property
  const products = (data as any)?.popularProducts || [];

  const addItemToCart = (item: any) => {
    const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItemIndex = currentCart.findIndex((cartItem: any) => cartItem.id === item.id);

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].qty += 1;
    } else {
      currentCart.push({ ...item, qty: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));

    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 2000);
  };

  return (
    <div className="mt-16 pt-10 border-t border-gray-100">
      <h2 className="text-[#253D4E] text-2xl font-bold mb-8 flex items-center gap-3">
         <span className="w-1.5 h-6 bg-[#3BB77E] rounded-full" />
         Popular {filters.category ? `in ${filters.category}` : "Products"}
      </h2>
      
      {loading ? (
        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar sm:grid sm:grid-cols-2 md:grid-cols-4 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="min-w-[280px] sm:min-w-0 h-72 bg-gray-50 rounded-2xl" />)}
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory no-scrollbar sm:grid sm:grid-cols-2 md:grid-cols-4">
          {products.map((item: any) => (
            <div key={item.id} className="min-w-[280px] sm:min-w-0 snap-start border border-gray-100 rounded-2xl p-4 bg-white hover:border-[#3BB77E] hover:shadow-lg transition-all group">
              <div className="relative aspect-square mb-4 bg-[#F8F8F8] rounded-xl overflow-hidden">
                <Image 
                  src={item.images[0]?.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  unoptimized 
                />
              </div>
              <h3 className="text-[#253D4E] font-bold text-sm line-clamp-2 mb-2 h-10">{item.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-[#3BB77E] font-bold">KES {parseFloat(item.price).toLocaleString()}</span>
                <button 
                  onClick={() => addItemToCart(item)}
                  className={`p-2 rounded-lg transition-all active:scale-90 ${
                    addedItemId === item.id 
                    ? "bg-orange-500 text-white" 
                    : "bg-[#def9ec] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white"
                  }`}
                >
                  {addedItemId === item.id ? <Check size={16} className="animate-in zoom-in" /> : <ShoppingCart size={16}/>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
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
  
  const [isAdded, setIsAdded] = useState(false);

  const { data, loading, error } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { slug },
    skip: !slug,
  });

  useEffect(() => {
    if ((data as any)?.productBySlug) {
      const product = (data as any).productBySlug;
      const recentViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const updatedList = [
        product,
        ...recentViewed.filter((item: any) => item.id !== product.id)
      ].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(updatedList));
    }
  }, [data]);

  const addToCart = () => {
    const product = (data as any).productBySlug;
    const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].qty += quantity;
    } else {
      currentCart.push({ ...product, qty: quantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse text-[#3BB77E] font-bold">Loading Fresh Products...</div>;
  if (error || !(data as any)?.productBySlug) return <div className="p-10 text-center font-bold text-[#253D4E]">Product not found.</div>;

  const product = (data as any).productBySlug;
  const galleryImages = product.images || [];
  const nutritionText = product.nutritionalInfo || "";

  // FIX: Explicitly type 'item' as string to resolve TypeScript build error
  const nutritionArray = nutritionText.split(';').map((item: string) => item.trim()).filter((item: string) => item !== "");
  const parsedNutrition = [];
  for (let i = 0; i < nutritionArray.length; i += 3) {
    if (nutritionArray[i]) {
      parsedNutrition.push({
        n: nutritionArray[i],
        a: nutritionArray[i + 1] || "\u2014",
        p: nutritionArray[i + 2] || "\u2014",
        b: !nutritionArray[i].startsWith('\u2013') 
      });
    }
  }

  const increment = () => quantity < (product.maxOrder || 100) && setQuantity((prev) => prev + 1);
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
            <ProductSidebar onFilterChange={handleFilterChange} />
          </div>

          <div className="flex-1 border border-[#3BB77E]/20 rounded-2xl p-4 md:p-8 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-12">
              <div className="space-y-4">
                <div className="border border-gray-100 rounded-xl overflow-hidden p-2 bg-white relative w-full aspect-square md:h-[450px]">
                  {galleryImages[selectedImage] && (
                    <Image 
                      src={galleryImages[selectedImage].image} 
                      alt={product.title} 
                      fill
                      className="object-contain p-2 hover:scale-105 transition-transform duration-500" 
                      unoptimized 
                    />
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {galleryImages.map((img: any, idx: number) => (
                    <button key={idx} onClick={() => setSelectedImage(idx)} className={`w-16 h-16 border rounded-lg overflow-hidden shrink-0 transition-all ${selectedImage === idx ? "border-[#3BB77E]" : "border-gray-100 opacity-60"}`}>
                      <Image src={img.image} alt="Thumb" width={80} height={80} className="object-cover w-full h-full" unoptimized />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[#253D4E] text-2xl md:text-3xl font-bold mb-3">{product.title}</h1>
                <div className="flex items-center gap-2 mb-6 text-[#FDC040]">
                  <div className="flex font-bold">{[...Array(5)].map((_, i) => (<Star key={i} size={14} fill="currentColor" />))}</div>
                  <span className="text-gray-400 text-xs ml-2">( 75 Reviews )</span>
                </div>

                <div className="space-y-2 text-sm mb-8 border-b border-gray-100 pb-6">
                  <p className="flex gap-2"><span className="font-bold text-gray-700 min-w-[100px]">Brand:</span> <span className="text-gray-500">{product.brand?.name}</span></p>
                  <p className="flex gap-2"><span className="font-bold text-gray-700 min-w-[100px]">Weight:</span> <span className="text-gray-500">{product.weight?.value} {product.weight?.unit}</span></p>
                  <p className="flex gap-2"><span className="font-bold text-gray-700 min-w-[100px]">Product SKU:</span> <span className="text-gray-500 font-mono uppercase">{product.sku}</span></p>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[#3BB77E] text-4xl font-bold">KES {parseFloat(product.price).toLocaleString()}</span>
                  {product.oldPrice && (<span className="text-gray-300 line-through text-xl italic">KES {parseFloat(product.oldPrice).toLocaleString()}</span>)}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-md h-12 overflow-hidden bg-white shadow-sm">
                    <button onClick={decrement} className="w-10 h-full hover:bg-gray-50 text-gray-400 transition-colors">\u2212</button>
                    <input type="number" value={quantity} readOnly className="w-12 text-center font-bold text-sm text-[#253D4E] outline-none appearance-none m-0 bg-transparent" />
                    <button onClick={increment} className="w-10 h-full hover:bg-gray-50 text-gray-400 transition-colors">+</button>
                  </div>
                  <button 
                    onClick={addToCart} 
                    disabled={isAdded}
                    className={`flex-1 ${isAdded ? 'bg-orange-500' : 'bg-[#3BB77E] hover:bg-[#2e9163]'} text-white px-10 h-12 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle size={18} /> Added!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} /> Add To Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <section className="animate-in fade-in duration-500">
                <h4 className="text-[#253D4E] font-bold text-xl mb-6 underline decoration-[#3BB77E] underline-offset-8">
                  1. Product Overview
                </h4>
                <p className="text-gray-600 mb-6 leading-7 text-sm max-w-4xl">{product.description}.</p>

                {!isExpanded && (
                  <button onClick={() => setIsExpanded(true)} className="flex items-center gap-2 text-[#3BB77E] font-bold text-sm hover:underline">
                    Read Full Technical Specs <ChevronDown size={16} />
                  </button>
                )}
              </section>

              {isExpanded && (
                <div className="space-y-16 pt-8 border-t border-gray-100 animate-in slide-in-from-top-4 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
                    <div className="space-y-4">
                      <h5 className="font-bold text-[#253D4E] uppercase text-xs tracking-widest flex items-center gap-2 font-bold"><Info size={14} /> Product Identity</h5>
                      <p><span className="text-gray-400 font-bold mr-2">SKU:</span>{product.sku}</p>
                      <p><span className="text-gray-400 font-bold mr-2">Barcode:</span>{product.barcode}</p>
                      <p><span className="text-gray-400 font-bold mr-2">Type:</span>{product.productType || "N/A"}</p>
                    </div>
                    <div className="space-y-4">
                      <h5 className="font-bold text-[#253D4E] uppercase text-xs tracking-widest flex items-center gap-2 font-bold"><Truck size={14} /> Commercial Information</h5>
                      <p><span className="text-gray-400 font-bold mr-2">Packaging:</span>{product.packagingType}</p>
                      <p><span className="text-gray-400 font-bold mr-2">Available Stock:</span>{product.totalStock} Units in warehouse</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h5 className="font-bold text-[#253D4E] uppercase text-xs tracking-widest flex items-center gap-2 font-bold"><Leaf size={14} /> Nutritional Content</h5>
                    
                    <div className="overflow-hidden border border-gray-100 rounded-xl max-w-2xl mb-8">
                      <div className="bg-[#f9fbfb] px-6 py-4 border-b border-gray-100">
                        <span className="text-[#253D4E] font-bold text-sm uppercase tracking-wide">Ingredients Composition</span>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {product.ingredients ? (
                          product.ingredients.split(',').map((ingredient: string, index: number) => (
                            <div key={index} className={`grid grid-cols-12 px-6 py-3 text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                              <div className="col-span-1 text-[#3BB77E] font-bold">{index + 1}.</div>
                              <div className="col-span-11 text-gray-600 italic capitalize">{ingredient.trim()}</div>
                            </div>
                          ))
                        ) : (
                          <div className="px-6 py-4 text-sm text-gray-500 italic">No specific ingredients listed.</div>
                        )}
                      </div>
                    </div>

                    <div className="max-w-md border-2 border-black p-4 bg-white font-sans text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                      <h6 className="text-3xl font-black border-b-[8px] border-black pb-1 uppercase tracking-tighter">Nutrition Facts</h6>
                      <div className="flex justify-between font-bold border-b-4 border-black py-1 text-xs uppercase tracking-wider">
                        <span>Nutrient</span>
                        <div className="flex gap-10">
                          <span>Amount</span>
                          <span>% DV*</span>
                        </div>
                      </div>
                      
                      <div className="divide-y-2 divide-black">
                        {parsedNutrition.length > 0 ? parsedNutrition.map((row, idx) => (
                          <div key={idx} className={`flex justify-between py-1.5 text-[14px] ${row.b ? "font-black" : "font-normal"}`}>
                            <span className={!row.b ? "pl-4" : ""}>{row.n}</span>
                            <div className="flex gap-4 min-w-[140px] justify-between">
                              <span>{row.a}</span>
                              <span className="w-12 text-right">{row.p}</span>
                            </div>
                          </div>
                        )) : (
                          <p className="py-4 text-xs italic text-gray-400">Nutritional data loading...</p>
                        )}
                      </div>

                      <div className="border-t-[8px] border-black mt-1 pt-2 text-[10px] leading-tight italic">
                        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
                    <div className="space-y-4">
                      <h5 className="font-bold text-[#253D4E] uppercase text-xs tracking-widest flex items-center gap-2"><ShieldCheck size={14} /> Manufacturing</h5>
                      <p><span className="text-gray-400 font-bold">Manufacturer:</span> {product.manufacturer || "Utamu Wetu Farms"}</p>
                      <p><span className="text-gray-400 font-bold">Origin:</span> Made in {product.countryOfOrigin || "Kenya"}</p>
                    </div>
                    <div className="space-y-4">
                      <h5 className="font-bold text-[#253D4E] uppercase text-xs tracking-widest flex items-center gap-2"><ThermometerSnowflake size={14} /> Storage</h5>
                      <p className="text-gray-600 leading-relaxed italic">{product.storageInstructions || "Store in a cool, dry place."}</p>
                    </div>
                    <div className="space-y-4">
                      <h5 className="font-bold text-[#253D4E] uppercase text-xs tracking-widest flex items-center gap-2"><Truck size={14} /> Delivery</h5>
                      <p className={`${product.requiresColdTransport ? "text-blue-600" : "text-gray-600"} font-bold flex items-center gap-1`}>
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
            </div>

            <PopularProductsGrid filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
}