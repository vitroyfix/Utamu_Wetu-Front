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
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import { GET_CATEGORIES, SEARCH_PRODUCTS } from "../../lib/queries";
// Redirection logic is imported but not used automatically during typing to prevent auto-delete/redirect
import { handleSmartSearch } from "../../lib/searchUtils";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Search Logic States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // API Hooks
  const { data: catData } = useQuery(GET_CATEGORIES);
  
  // Use LazyQuery for efficient backend searching
  const [executeSearch, { data: searchData, loading: searchLoading }] = useLazyQuery(SEARCH_PRODUCTS);

  const categories = catData?.allCategories || [];
  const searchResults = searchData?.allProducts || [];

  // Helper to highlight matching text like in the Carrefour image
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="font-normal text-gray-500">{part}</span>
      ) : (
        <span key={i} className="font-bold text-[#253D4E]">{part}</span>
      )
    );
  };

  // FIXED SEARCH LOGIC: Removed automatic redirection to prevent autodelete/jumping
  useEffect(() => {
    const query = searchQuery.trim();
    
    if (query.length > 1) {
      // Execute only the backend search to display results in the dropdown
      // This ensures you stay on the current page while searching
      executeSearch({ 
        variables: { searchTerm: query },
        fetchPolicy: "network-only" 
      });
    }
  }, [searchQuery, executeSearch]);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery("");
        if (window.innerWidth < 1024) setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Category", href: "/shop", hasDropdown: true },
    { name: "Products", href: "/shop", hasDropdown: true },
    { name: "Pages", href: "/shop", hasDropdown: true },
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
        <div className="container mx-auto px-4 grid grid-cols-3 items-center py-3">
          <div /> 

          <div className="flex items-center justify-center gap-8 text-[14px] font-medium text-gray-700">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative group h-full py-1"
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {/* RESTORED: Standard Link for redirection, Chevron for visual indicator */}
                <Link href={link.href} className="flex items-center gap-1 transition-all duration-300 hover:text-[#3BB77E] hover:scale-110 active:scale-95 transform origin-center">
                  {link.name} {link.hasDropdown && <ChevronDown size={14} />}
                </Link>

                {link.hasDropdown && activeDropdown === link.name && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 z-[1100]">
                    <div className="bg-white border border-gray-100 shadow-xl rounded-lg py-4 transition-all duration-200">
                      {link.name === "Category" && categories.map((cat: any) => (
                        <Link key={cat.id} href={`/shop?category=${cat.name}`} onClick={() => setActiveDropdown(null)} className="block px-8 py-3 text-gray-700 hover:text-[#3BB77E] hover:bg-gray-50 font-medium text-sm">
                          {cat.name}
                        </Link>
                      ))}
                      {link.name === "Products" && productSections.map((section) => (
                        <Link key={section.name} href={section.href} onClick={() => setActiveDropdown(null)} className="block px-8 py-3 text-gray-700 hover:text-[#3BB77E] hover:bg-gray-50 font-medium text-sm">
                          {section.name}
                        </Link>
                      ))}
                      {link.name === "Pages" && createdPages.map((page) => (
                        <Link key={page.name} href={page.href} onClick={() => setActiveDropdown(null)} className="block px-8 py-3 text-gray-700 hover:text-[#3BB77E] hover:bg-gray-50 font-medium text-sm">
                          {page.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-1 text-[14px] text-gray-700">
            <Phone size={16} className="text-[#3BB77E]" />
            <span>+254xxxxxxxxxxxx</span>
          </div>
        </div>
      </div>

      {/* 2. Main Header Section */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4 h-20 relative z-[1001] bg-white">
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

        {/* Updated Desktop Search Bar (Carrefour Style) */}
        <div className="hidden lg:flex flex-1 max-w-xl relative" ref={searchRef}>
          <div className="flex w-full items-center border-2 border-[#BCE3C9] rounded-[5px] h-11 overflow-hidden focus-within:border-[#3BB77E] transition-all bg-[#F8F9FA]">
             <div className="pl-3 text-gray-400">
               <Search size={18} />
             </div>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 text-sm outline-none bg-transparent font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="pr-3 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
          
          {searchQuery && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 shadow-2xl rounded-lg overflow-hidden z-[2005] animate-in fade-in slide-in-from-top-1">
              <div className="py-2 max-h-[400px] overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((p: any) => (
                    <Link 
                      key={p.id} 
                      href={`/product/${p.slug}`} 
                      onClick={() => setSearchQuery("")} 
                      className="flex items-center justify-between px-4 py-3 hover:bg-blue-50/50 group border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <Search size={16} className="text-gray-300" />
                        <span className="text-sm">
                          {highlightMatch(p.title, searchQuery)}
                        </span>
                      </div>
                      <ArrowRight size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))
                ) : !searchLoading && (
                  <div className="p-8 text-center">
                     <p className="text-gray-400 text-sm font-medium italic">No matches found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
              
              {/* Footer action like "See all results" */}
              {searchResults.length > 0 && (
                <button 
                  onClick={() => {router.push(`/shop?search=${searchQuery}`); setSearchQuery("");}}
                  className="w-full py-3 bg-gray-50 text-[#3BB77E] text-xs font-black uppercase tracking-wider hover:bg-[#def9ec] transition-colors border-t border-gray-100"
                >
                  View all results for "{searchQuery}"
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-8 shrink-0">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="lg:hidden bg-[#ffffff] h-9 w-9 rounded-[5px] text-black flex items-center justify-center border border-gray-100 transition-colors hover:bg-gray-50">
            {isSearchOpen ? <X size={18} /> : <Search size={16} />}
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

      {/* Mobile Search Dropdown */}
      {isSearchOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl z-[2005] p-4 animate-in slide-in-from-top-4">
          <div className="flex items-center border-2 border-[#BCE3C9] rounded-[5px] h-12 overflow-hidden focus-within:border-[#3BB77E]">
            <input autoFocus type="text" placeholder="Search groceries..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-4 text-sm outline-none bg-transparent" />
          </div>
          {searchQuery && (
             <div className="mt-4 max-h-60 overflow-y-auto bg-gray-50 rounded-xl p-4">
                {searchResults.length > 0 ? (
                  searchResults.map((p: any) => (
                    <Link key={p.id} href={`/product/${p.slug}`} onClick={() => {setIsSearchOpen(false); setSearchQuery("");}} className="flex justify-between items-center p-3 hover:bg-white rounded-lg mb-2 shadow-sm transition-all">
                      <span className="font-bold text-[#253D4E] text-sm">{p.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${p.totalStock > 0 ? 'text-[#3BB77E] bg-[#def9ec]' : 'text-red-400 bg-red-50'}`}>
                        {p.totalStock > 0 ? 'In Stock' : 'Finished'}
                      </span>
                    </Link>
                  ))
                ) : !searchLoading && (
                  <p className="text-center text-gray-400 text-xs py-4 font-bold uppercase">No results</p>
                )}
             </div>
          )}
        </div>
      )}

      {/* Mobile Menu */}
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
                <div className="bg-gray-50 rounded-xl p-4 mt-2 space-y-4">
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