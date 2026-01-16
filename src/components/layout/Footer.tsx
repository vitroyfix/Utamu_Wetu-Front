import { MapPin, Mail, Phone, Send, Facebook, Twitter, Globe, Instagram } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-white font-sans pt-16 pb-8 border-t border-gray-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute left-4 top-1/4 opacity-10 pointer-events-none">
        <span className="text-6xl">🍋</span>
      </div>
      <div className="absolute right-8 bottom-1/4 opacity-10 pointer-events-none">
        <span className="text-6xl">🌶️</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand & Contact Section */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="flex items-center gap-2">
              {/* Logo with groceries.webp */}
              <div className="relative w-10 h-10 md:w-12 md:h-12 bg-[#F2F3F4] rounded-full overflow-hidden flex items-center justify-center border border-[#BCE3C9]">
                <Image 
                  src="/groceries.webp" 
                  alt="Utamu Wetu Logo" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-none text-[#253D4E]">Utamu Wetu</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Organic Grocery Store</span>
              </div>
            </Link>
            <p className="text-gray-500 text-[14px] leading-relaxed">
              Utamu Wetu is the biggest market of grocery products. Get your daily needs from our store.
            </p>
            <div className="space-y-4 text-[14px] text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="text-[#3BB77E] shrink-0 mt-1" size={18} />
                <span>Westlands, Nairobi</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-[#3BB77E] shrink-0" size={18} />
                <span>example@email.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-[#3BB77E] shrink-0" size={18} />
                +254xxxxxxxxxx
              </div>
            </div>
          </div>

          {/* 2. Company Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-[#253D4E]">Company</h4>
            <ul className="space-y-4 text-[14px] text-gray-600">
              <li><Link href="/about" className="hover:text-[#3BB77E] hover:translate-x-1 transition-all inline-block">About Us</Link></li>
              <li><Link href="/delivery" className="hover:text-[#3BB77E] hover:translate-x-1 transition-all inline-block">Delivery Information</Link></li>
              <li><Link href="/privacy" className="hover:text-[#3BB77E] hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#3BB77E] hover:translate-x-1 transition-all inline-block">Terms & Conditions</Link></li>
              <li><Link href="/contact" className="hover:text-[#3BB77E] hover:translate-x-1 transition-all inline-block">contact Us</Link></li>
              <li><Link href="/support" className="hover:text-[#3BB77E] hover:translate-x-1 transition-all inline-block">Support Center</Link></li>
            </ul>
          </div>

          {/* 3. Category Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-[#253D4E]">Category</h4>
            <ul className="space-y-4 text-[14px] text-gray-600">
              <li><Link href="/category/dairy" className="hover:text-[#3BB77E] hover:translate-x-1 transition-all inline-block">Dairy & Bakery</Link></li>
              <li><Link href="/category/fruits" className="hover:text-[#3BB77E] hover:translate-x-1 transition-all inline-block">Fruits & Vegetable</Link></li>
              <li><Link href="/category/snacks" className="hover:text-[#3BB77E] hover:translate-x-1 transition-all inline-block">Snack & Spice</Link></li>
              <li><Link href="/category/juice" className="hover:text-[#3BB77E] hover:translate-x-1 transition-all inline-block">Juice & Drinks</Link></li>
              <li><Link href="/category/meat" className="hover:text-[#3BB77E] hover:translate-x-1 transition-all inline-block">Chicken & Meat</Link></li>
              <li><Link href="/category/fast-food" className="hover:text-[#3BB77E] hover:translate-x-1 transition-all inline-block">Fast Food</Link></li>
            </ul>
          </div>

          {/* 4. Newsletter & Socials */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-lg font-bold text-[#253D4E]">Subscribe Our Newsletter</h4>
            <div className="flex items-center border border-gray-100 rounded-md p-1 shadow-sm focus-within:border-[#3BB77E] transition-all bg-white">
              <input 
                type="email" 
                placeholder="Search here..." 
                className="flex-1 px-4 py-2 text-sm outline-none"
              />
              <button className="p-2 text-gray-700 hover:text-[#3BB77E] transition-colors">
                <Send size={20} className="rotate-45" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Globe, Instagram].map((Icon, idx) => (
                <div key={idx} className="w-10 h-10 border border-gray-100 rounded-md flex items-center justify-center text-gray-600 hover:bg-[#3BB77E] hover:text-white hover:border-[#3BB77E] cursor-pointer transition-all">
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 text-center text-[14px] text-gray-500">
          <p>© 2026 <span className="text-[#FF6262] font-bold">Utamu Wetu</span>, All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}