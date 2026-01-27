"use client";

import {
  Search,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
  Phone,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Synchronize cart count with localStorage
  useEffect(() => {
    const updateCount = () => {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        const items = JSON.parse(savedCart);
        // Summing up the quantities of all items
        const total = items.reduce(
          (acc: number, item: any) => acc + (item.qty || 1),
          0,
        );
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    };

    // Initial load
    updateCount();

    // Listen for storage changes (helpful for multi-tab sync)
    window.addEventListener("storage", updateCount);
    // Custom event to trigger update within the same tab
    window.addEventListener("cartUpdated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cartUpdated", updateCount);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Category", href: "/categories", hasDropdown: true },
    { name: "Products", href: "/products", hasDropdown: true },
    { name: "Pages", href: "/pages", hasDropdown: true },
    { name: "Blog", href: "/blog", hasDropdown: true },
    { name: "Elements", href: "/elements", hasDropdown: true },
  ];

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full bg-white font-sans border-b border-gray-100 sticky top-0 z-[999]">
      {/* 1. Top Utility Bar */}
      <div className="hidden lg:block border-b border-gray-100 relative z-[1000]">
        <div className="container mx-auto px-100 flex justify-between items-center py-3">
          <div className="flex items-center gap-8 text-[14px] font-medium text-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-1 transition-all duration-300 ease-out hover:text-[#3BB77E] hover:scale-110 active:scale-95 transform origin-left"
              >
                {link.name} {link.hasDropdown && <ChevronDown size={14} />}
              </Link>
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
              <Image
                src="/groceries.webp"
                alt="Utamu Wetu Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-2xl font-bold leading-none text-[#253D4E]">
                Utamu Wetu
              </span>
              <span className="text-[7px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Organic Grocery Store
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 max-w-[180px] xs:max-w-[240px] sm:max-w-[380px] md:max-w-[700px] items-center border-2 border-[#BCE3C9] rounded-[5px] h-9 md:h-11 overflow-hidden transition-all duration-300 focus-within:border-[#3BB77E] focus-within:shadow-sm">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 w-full px-2 md:px-4 text-[11px] md:text-sm outline-none bg-transparent"
          />
          <button
            type="submit"
            className="bg-[#FF6262] hover:bg-red-600 active:bg-red-700 transition-colors h-full px-3 md:px-6 text-white flex items-center justify-center shrink-0"
          >
            <Search size={16} className="md:w-5 md:h-5" />
          </button>
        </div>

        {/* Action Icons Section */}
        <div className="flex items-center gap-3 md:gap-8 shrink-0">
          {/* Account */}
          <Link
            href="/account"
            className="hidden xs:flex items-center gap-1 md:gap-2 cursor-pointer group transition-all duration-300 hover:scale-110"
          >
            <User
              size={18}
              className="text-gray-700 group-hover:text-[#3BB77E] md:w-6 md:h-6"
            />
            <span className="hidden xl:block text-[15px] font-medium text-gray-700 group-hover:text-[#3BB77E]">
              Account
            </span>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="flex items-center gap-1 md:gap-2 cursor-pointer group transition-all duration-300 hover:scale-110"
          >
            <div className="relative">
              <Heart
                size={18}
                className="text-gray-700 group-hover:text-[#3BB77E] md:w-6 md:h-6"
              />
              <span className="absolute -top-1.5 -right-1.5 bg-[#3BB77E] text-white text-[7px] md:text-[10px] w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center font-bold border border-white">
                0
              </span>
            </div>
            <span className="hidden xl:block text-[15px] font-medium text-gray-700 group-hover:text-[#3BB77E]">
              Wishlist
            </span>
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1 md:gap-2 cursor-pointer group transition-all duration-300 hover:scale-110"
          >
            <div className="relative">
              <ShoppingCart
                size={18}
                className="text-gray-700 group-hover:text-[#3BB77E] md:w-6 md:h-6"
              />
              <span className="absolute -top-1.5 -right-1.5 bg-[#3BB77E] text-white text-[7px] md:text-[10px] w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center font-bold border border-white">
                {cartCount}
              </span>
            </div>
            <span className="hidden xl:block text-[15px] font-medium text-gray-700 group-hover:text-[#3BB77E]">
              Cart
            </span>
          </Link>
        </div>
      </div>

      {/* 3. Separate Mobile/Tablet Menu Part */}
      <div
        className={`
          lg:hidden absolute top-[calc(100%+8px)] left-0 w-full bg-white shadow-2xl rounded-b-xl border border-gray-100 
          transition-all duration-500 ease-in-out z-[2000]
          ${isMobileMenuOpen ? "block opacity-100 translate-y-0" : "hidden opacity-0 -translate-y-5"}
        `}
      >
        <div className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="
                text-gray-800 font-semibold text-lg py-3 px-4 rounded-xl 
                flex justify-between items-center transition-all duration-300 
                hover:bg-[#def9ec] hover:text-[#3BB77E] hover:translate-x-4
                active:bg-[#3BB77E] active:text-white
              "
            >
              {link.name}
              {link.hasDropdown && (
                <ChevronDown size={18} className="text-gray-300" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
