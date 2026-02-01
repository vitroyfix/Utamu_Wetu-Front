"use client";

import {
  Search,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Phone,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES, GET_POPULAR_PRODUCTS } from "../../lib/queries";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Search Logic States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: catData } = useQuery(GET_CATEGORIES);
  const { data: prodData } = useQuery(GET_POPULAR_PRODUCTS);

  const categories = catData?.allCategories || [];
  const allProducts = prodData?.popularProducts || [];

  const searchResults = searchQuery 
    ? allProducts.filter((p: any) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const updateCount = () => {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        const items = JSON.parse(savedCart);
        const total = items.reduce((acc: number, item: any) => acc + (item.qty || 1), 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    };
    updateCount();
    window.addEventListener("cartUpdated", updateCount);
    return () => window.removeEventListener("cartUpdated", updateCount);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Category", href: "/categories", hasDropdown: true },
    { name: "Products", href: "/products", hasDropdown: true },
    { name: "Pages", href: "/pages", hasDropdown: true },
    { name: "Blog", href: "/blog", hasDropdown: true },
    { name: "Elements", href: "/elements", hasDropdown: true },
  ];

  const productSections = [
    { name: "Daily Best Sells", href: "/shop?filter=best-sells" },
    { name: "Popular Products", href: "/shop?filter=popular" },
    { name: "Deals of the Day", href: "/shop?filter=deals" },
    { name: "Recently Added", href: "/shop?filter=recent" },
    { name: "Top Rated", href: "/shop?filter=top-rated" },
  ];

  const createdPages = [
    { name: "Shopping Page", href: "/shop" },
    { name: "Your Cart", href: "/cart" },
    { name: "Product Details", href: "/shop" },
    { name: "Checkout", href: "/checkout" },
  ];

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileDropdown = (name: string) => {
    setMobileDropdown(mobileDropdown === name ? null : name);
  };

  return (
    <header className="w-full bg-white font-sans border-b border-gray-100 sticky top-0 z-[999]">
      {/* 1. Top Utility Bar */}
      <div className="hidden lg:block border-b border-gray-100 relative z-[1010]">
        <div className="container mx-auto px-100 flex justify-between items-center py-3">
          <div className="flex items-center gap-8 text-[14px] font-medium text-gray-700">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative group"
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link href={link.href} className="flex items-center gap-1 transition-all duration-300 hover:text-[#3BB77E] hover:scale-110 active:scale-95 transform origin-left">
                  {link.name} {link.hasDropdown && <ChevronDown size={14} />}
                </Link>

                {link.hasDropdown && activeDropdown === link.name && (
                  <div className="absolute top-full left-0 pt-2 w-64 z-[1100]">
                    <div className="bg-white border border-gray-100 shadow-xl rounded-lg py-4 transition-all duration-200">
                      {link.name === "Category" && categories.map((cat: any) => (
                        <Link key={cat.id} href={`/shop?category=${cat.name}`} className="block px-8 py-3 text-gray-700 hover:text-[#3BB77E] hover:bg-gray-50 font-medium text-sm">
                          {cat.name}
                        </Link>
                      ))}
                      {link.name === "Products" && productSections.map((section) => (
                        <Link key={section.name} href={section.href} className="block px-8 py-3 text-gray-700 hover:text-[#3BB77E] hover:bg-gray-50 font-medium text-sm">
                          {section.name}
                        </Link>
                      ))}
                      {link.name === "Pages" && createdPages.map((page) => (
                        <Link key={page.name} href={page.href} className="block px-8 py-3 text-gray-700 hover:text-[#3BB77E] hover:bg-gray-50 font-medium text-sm">
                          {page.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 ml-[10] mr-[0]n text-[14px] text-gray-700">
            <Phone size={16} className="text-[#3BB77E]" />
            <span>+254xxxxxxxxxxxx</span>
          </div>
        </div>
      </div>

      {/* 2. Main Header Section */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-2 md:gap-6 h-20 relative z-[1001] bg-white">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleToggle}
            type="button"
            className="lg:hidden p-2 text-gray-700 hover:bg-[#def9ec] hover:text-[#3BB77E] rounded-md transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <Link href="/" className="flex items-center gap-1 md:gap-3">
            <div className="relative w-10 h-10 md:w-14 md:h-14 bg-[#F2F3F4] rounded-full overflow-hidden flex items-center justify-center border-2 border-[#BCE3C9]">
              <Image src="/groceries.webp" alt="Logo" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-2xl font-bold leading-none text-[#253D4E]">Utamu Wetu</span>
              <span className="text-[7px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold">Organic Grocery Store</span>
            </div>
          </Link>
        </div>

        {/* Action Icons & Search Toggle */}
        <div className="flex items-center gap-3 md:gap-8 shrink-0">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="bg-[#ffffff] hover:bg-red-600 active:bg-red-700 transition-colors h-9 w-9 md:h-11 md:w-11 rounded-[5px] text-black flex items-center justify-center"
          >
            {isSearchOpen ? <X size={18} /> : <Search size={16} className="md:w-5 md:h-5" />}
          </button>

          <Link href="/wishlist" className="flex items-center gap-1 group transition-all duration-300 hover:scale-110">
            <div className="relative">
              <Heart size={18} className="text-gray-700 group-hover:text-[#3BB77E] md:w-6 md:h-6" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#3BB77E] text-white text-[7px] md:text-[10px] w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center font-bold border border-white">0</span>
            </div>
          </Link>

          <Link href="/cart" className="flex items-center gap-1 group transition-all duration-300 hover:scale-110">
            <div className="relative">
              <ShoppingCart size={18} className="text-gray-700 group-hover:text-[#3BB77E] md:w-6 md:h-6" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#3BB77E] text-white text-[7px] md:text-[10px] w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center font-bold border border-white">{cartCount}</span>
            </div>
            <span className="hidden xl:block text-[15px] font-medium text-gray-700 group-hover:text-[#3BB77E]">Cart</span>
          </Link>
        </div>
      </div>

      {/* --- SEARCH DROP DOWN PANEL --- */}
      {isSearchOpen && (
        <div ref={searchRef} className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl z-[2005] animate-in slide-in-from-top-4 duration-300 p-4">
          <div className="container mx-auto">
            <div className="flex items-center border-2 border-[#BCE3C9] rounded-[5px] h-12 overflow-hidden focus-within:border-[#3BB77E]">
              <input
                autoFocus
                type="text"
                placeholder="Search for organic groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 text-sm outline-none bg-transparent"
              />
            </div>
            
            {searchQuery && (
              <div className="mt-4 max-h-60 overflow-y-auto bg-gray-50 rounded-xl p-4">
                {searchResults.length > 0 ? (
                  searchResults.map((p: any) => (
                    <Link key={p.id} href={`/product/${p.slug}`} onClick={() => setIsSearchOpen(false)} className="flex justify-between items-center p-3 hover:bg-white rounded-lg mb-2 shadow-sm transition-all">
                      <span className="font-bold text-[#253D4E] text-sm">{p.title}</span>
                      {p.totalStock > 0 ? (
                        <span className="text-[#3BB77E] text-[10px] font-bold bg-[#def9ec] px-2 py-1 rounded-full uppercase">In Stock</span>
                      ) : (
                        <span className="text-red-400 text-[10px] font-bold bg-red-50 px-2 py-1 rounded-full uppercase">Finished</span>
                      )}
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-gray-400 text-xs py-4 font-bold">We do not have that product.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Mobile Menu Part - Elevated Z-Index */}
      <div className={`lg:hidden fixed inset-0 top-20 w-full bg-white shadow-2xl z-[2000] transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
        <div className="flex flex-col p-6 space-y-4 overflow-y-auto h-full pb-32">
          {navLinks.map((link) => (
            <div key={link.name} className="border-b border-gray-50 pb-2">
              <div className="flex items-center justify-between py-3">
                <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-bold text-lg">{link.name}</Link>
                {link.hasDropdown && (
                  <button onClick={() => toggleMobileDropdown(link.name)} className="p-2 bg-gray-50 rounded-lg">
                    {mobileDropdown === link.name ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                )}
              </div>
              {link.hasDropdown && mobileDropdown === link.name && (
                <div className="bg-gray-50 rounded-xl p-4 mt-2 space-y-4 animate-in slide-in-from-top-2">
                  {link.name === "Category" && categories.map((cat: any) => (
                    <Link key={cat.id} href={`/shop?category=${cat.name}`} onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 font-medium ml-2 text-sm">{cat.name}</Link>
                  ))}
                  {link.name === "Products" && productSections.map((sec) => (
                    <Link key={sec.name} href={sec.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 font-medium ml-2 text-sm">{sec.name}</Link>
                  ))}
                  {link.name === "Pages" && createdPages.map((page) => (
                    <Link key={page.name} href={page.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 font-medium ml-2 text-sm">{page.name}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}