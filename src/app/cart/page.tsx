"use client";
import React, { useState, useEffect } from "react"; 
import Link from "next/link";
import Image from "next/image";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShoppingBag, 
  Star 
} from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { GET_POPULAR_PRODUCTS } from "../../lib/queries";

export default function CartPage() {
  const { data: recentData, loading: recentLoading } = useQuery(GET_POPULAR_PRODUCTS, {
    variables: { maxPrice: 10000 }
  });
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("recentlyViewed");
    const savedCart = localStorage.getItem("cartItems");
    if (savedHistory) setRecentlyViewed(JSON.parse(savedHistory));
    if (savedCart) setCartItems(JSON.parse(savedCart));
    setIsMounted(true);
  }, []);

  const syncCart = (updatedCart: any[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const VAT_RATE = 0.16; 
  const SHIPPING_FEE = 150.00;
  const SERVICE_FEE = 50.00;

  const addToCart = (product: any) => {
    const existing = cartItems.find(item => item.id === product.id);
    let updated;
    if (existing) {
      updated = cartItems.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updated = [...cartItems, { ...product, qty: 1 }];
    }
    syncCart(updated);
  };

  const updateQty = (id: number, delta: number) => {
    const updated = cartItems.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    syncCart(updated);
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter(item => item.id !== id);
    syncCart(updated);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.qty), 0);
  const vatAmount = subtotal * VAT_RATE;
  const totalAmount = subtotal + vatAmount + SHIPPING_FEE + SERVICE_FEE;

  if (!isMounted) return null;

  return (
    <div className="bg-[#fcfdfd] min-h-screen font-sans">
      <div className="bg-[#3BB77E] py-6 md:py-8 mb-6 md:mb-12">
        <div className="container mx-auto px-4">
          <nav className="text-white text-[10px] md:text-[11px] uppercase tracking-wider font-bold flex items-center gap-2 md:gap-3">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span className="text-white/40">/</span>
            <Link href="/cart" className="hover:text-white/80 transition-colors">Cart</Link>
            <span className="text-white/40">/</span>
            <span className="text-white">Your Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {cartItems.length > 0 ? (
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="xl:w-3/4">
              <div className="hidden md:block overflow-hidden border border-gray-100 rounded-3xl shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8fbf9] text-[#253D4E] font-bold text-xs uppercase tracking-widest border-b border-gray-100">
                      <th className="px-6 xl:px-10 py-6">Product Item</th>
                      <th className="px-6 xl:px-10 py-6">Unit Price</th>
                      <th className="px-6 xl:px-10 py-6 text-center">Quantity</th>
                      <th className="px-6 xl:px-10 py-6">Subtotal</th>
                      <th className="px-6 xl:px-10 py-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cartItems.map((item) => (
                      <tr key={item.id} className="group hover:bg-[#3BB77E]/[0.02] transition-colors">
                        <td className="px-6 xl:px-10 py-8 flex items-center gap-4 xl:gap-8">
                          <div className="relative w-20 h-20 xl:w-28 xl:h-28 bg-[#F2F3F4] rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                            <Image src={item.images?.[0]?.image || "/placeholder.webp"} alt={item.title} fill className="object-contain p-2 xl:p-4" unoptimized />
                          </div>
                          <span className="block font-bold text-[#253D4E] text-base xl:text-lg leading-tight">{item.title}</span>
                        </td>
                        <td className="px-6 xl:px-10 py-8 text-gray-400 font-semibold text-sm xl:text-base whitespace-nowrap">KES {parseFloat(item.price).toFixed(2)}</td>
                        <td className="px-6 xl:px-10 py-8">
                          <div className="flex items-center justify-center border border-[#BCE3C9]/50 rounded-xl w-28 xl:w-36 h-10 xl:h-12 mx-auto bg-white shadow-sm">
                            <button onClick={() => updateQty(item.id, -1)} className="flex-1 h-full flex items-center justify-center hover:bg-[#def9ec] hover:text-[#3BB77E] transition-all"><Minus size={12} strokeWidth={3} /></button>
                            <span className="w-8 text-center font-black text-[#253D4E]">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="flex-1 h-full flex items-center justify-center hover:bg-[#def9ec] hover:text-[#3BB77E] transition-all"><Plus size={12} strokeWidth={3} /></button>
                          </div>
                        </td>
                        <td className="px-6 xl:px-10 py-8 font-black text-[#3BB77E] text-base xl:text-xl whitespace-nowrap">KES {(parseFloat(item.price) * item.qty).toFixed(2)}</td>
                        <td className="px-6 xl:px-10 py-8 text-right">
                          <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 xl:p-3 rounded-2xl transition-all"><Trash2 className="w-5 h-5 xl:w-6 xl:h-6" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-4 flex gap-4 shadow-sm relative">
                    <button onClick={() => removeItem(item.id)} className="absolute top-4 right-4 text-red-400 p-1">
                      <Trash2 size={18} />
                    </button>
                    <div className="relative w-24 h-24 bg-[#F2F3F4] rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                      <Image src={item.images?.[0]?.image || "/placeholder.webp"} alt={item.title} fill className="object-contain p-2" unoptimized />
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-1">
                      <div>
                        <h4 className="font-bold text-[#253D4E] text-sm leading-tight pr-6">{item.title}</h4>
                        <p className="text-[#3BB77E] font-black text-base mt-1">KES {(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center border border-[#BCE3C9]/50 rounded-xl w-28 h-9 bg-white shadow-sm mt-2">
                        <button onClick={() => updateQty(item.id, -1)} className="flex-1 h-full flex items-center justify-center"><Minus size={10} strokeWidth={3} /></button>
                        <span className="w-8 text-center font-black text-[#253D4E] text-xs">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="flex-1 h-full flex items-center justify-center"><Plus size={10} strokeWidth={3} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:w-1/4">
              <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/10 xl:sticky xl:top-24">
                <h3 className="text-[#253D4E] font-black text-lg mb-6">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-400 font-bold text-sm">
                    <span>Subtotal</span>
                    <span className="text-[#253D4E]">KES {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-bold text-sm">
                    <span>Shipping</span>
                    <span className="text-[#3BB77E]">KES {SHIPPING_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-bold text-sm">
                    <span>VAT (16%)</span>
                    <span className="text-[#253D4E]">KES {vatAmount.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-end">
                    <span className="text-[#253D4E] font-black text-sm">Grand Total</span>
                    <span className="text-[#3BB77E] text-xl md:text-2xl font-black">KES {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full bg-[#3BB77E] hover:bg-[#253D4E] text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3">
                  Checkout <ShoppingBag size={18} />
                </button>
              </div>
              <div className="mt-6"> 
                <Link href="/products" className="flex items-center justify-center gap-2 text-gray-400 font-bold text-sm hover:text-[#3BB77E] transition-all">
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 md:py-20 bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] shadow-sm animate-in fade-in duration-500">
            <div className="bg-[#def9ec] p-6 md:p-8 rounded-full mb-6 text-[#3BB77E]">
               <ShoppingBag size={48} className="md:hidden" />
               <ShoppingBag size={64} className="hidden md:block" />
            </div>
            <h2 className="text-[#253D4E] text-xl md:text-3xl font-black mb-3 px-4 text-center">Your Cart is Currently Empty</h2>
            <Link href="/products" className="bg-[#3BB77E] hover:bg-[#253D4E] text-white font-black px-8 md:px-10 py-3 md:py-4 rounded-2xl transition-all flex items-center gap-3 text-sm md:text-base">
              <ArrowLeft size={18} /> Back to Shopping
            </Link>
          </div>
        )}

        {/* Recently Viewed Grid */}
        <div className="pt-12 md:pt-20 mt-12 md:mt-20 border-t border-gray-50">
          <h2 className="text-[#253D4E] text-xl md:text-2xl font-black mb-8 md:mb-10 flex items-center gap-3">
            <span className="w-2 h-7 bg-[#3BB77E] rounded-full" /> Recently Viewed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {(recentlyViewed.length > 0 ? recentlyViewed : (recentData?.popularProducts || [])).slice(0, 4).map((item: any) => (
              <div key={item.id} className="group border border-gray-50 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 bg-white relative overflow-hidden transition-all duration-300 hover:border-[#3BB77E] hover:shadow-[0_0_15px_rgba(59,183,126,0.15)]">
                <div className="relative aspect-square mb-4 md:mb-6 bg-[#f9fbfb] rounded-2xl md:rounded-3xl overflow-hidden">
                  <Image src={item.images?.[0]?.image || "/placeholder.webp"} alt={item.title} fill className="object-contain p-4 md:p-6 group-hover:scale-110 transition-transform duration-700" unoptimized />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <span className="text-[8px] md:text-[9px] text-[#3BB77E] bg-[#def9ec] px-3 py-1 rounded-full font-black uppercase tracking-widest">{item.category?.name || "Product"}</span>
                  <h3 className="text-[#253D4E] font-extrabold text-xs md:text-sm h-8 md:h-10 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-50">
                    <span className="text-[#3BB77E] font-black text-base md:text-lg">KES {parseFloat(item.price).toLocaleString()}</span>
                    <button onClick={() => addToCart(item)} className="bg-[#3BB77E] text-white p-2.5 md:p-3 rounded-xl md:rounded-2xl hover:bg-[#42e064] transition-all">
                      <Plus className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}