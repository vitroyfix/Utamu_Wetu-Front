"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Smartphone, CreditCard, Calendar, 
  ShieldCheck, ShoppingBag, Map as MapIcon, 
  Store, Navigation, ArrowRight, Banknote, User,
  Truck, FastForward, Clock, PlusCircle, Wallet, Coins, Percent,
  Home, Hash, Landmark
} from "lucide-react";
import { GET_USER_PROFILE, CREATE_ORDER } from "../../lib/queries";

export default function CheckoutPage() {
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [deliveryType, setDeliveryType] = useState<"address" | "pickup" | "map" | "new">("address");
  const [shippingSpeed, setShippingSpeed] = useState<string>("standard");
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("mpesa");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [useWallet, setUseWallet] = useState(false);

  // --- API HOOKS ---
  const { data: profileData } = useQuery(GET_USER_PROFILE, { skip: !isLoggedIn });
  const [createOrder, { loading: isPlacingOrder }] = useMutation(CREATE_ORDER);

  const user = profileData?.me;
  const addresses = user?.addresses || [];
  const walletBalance = user?.balance || 0; 
  const loyaltyPoints = user?.coins || 0; 

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    checkAuth();
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCartItems(JSON.parse(savedCart));
    setIsMounted(true);
    window.addEventListener("authChanged", checkAuth);
    return () => window.removeEventListener("authChanged", checkAuth);
  }, []);

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.qty), 0);
  const SHIPPING_FEE = shippingSpeed === "express" ? 350.00 : 150.00;
  const vatAmount = subtotal * 0.16;
  const pointsDiscount = usePoints ? (loyaltyPoints / 100) * 10 : 0;
  let totalAmount = subtotal + vatAmount + SHIPPING_FEE - pointsDiscount;
  const walletDeduction = useWallet ? Math.min(walletBalance, totalAmount) : 0;
  const finalPayable = totalAmount - walletDeduction;

  const handlePlaceOrder = async () => {
    if ((deliveryType === "address" || deliveryType === "new") && !selectedAddress && deliveryType !== "new") {
        return alert("Please select or add an address.");
    }
    try {
      const itemsJson = JSON.stringify(cartItems.map(item => ({ id: item.id, qty: item.qty })));
      const { data } = await createOrder({ 
        variables: { addressId: selectedAddress || 1, itemsJson } 
      });
      if (data?.createOrder?.order) {
        localStorage.removeItem("cartItems");
        window.dispatchEvent(new Event("cartUpdated"));
        router.push(`/order-success?orderNumber=${data.createOrder.order.orderNumber}`);
      }
    } catch (err) { alert("Checkout failed."); }
  };

  if (!isMounted) return null;

  return (
    <div className="bg-[#fcfdfd] min-h-screen font-sans text-[#253D4E] pb-10">
      {/* HEADER - FLUID TYPOGRAPHY */}
      <div className="bg-[#3BB77E] py-4 md:py-8 lg:py-12 shadow-sm mb-6">
        <div className="container mx-auto px-4">
          <h1 className="text-xl md:text-1xl lg:text-2xl font-black text-white uppercase tracking-tight mb-2">Checkout</h1>
          <nav className="text-white/80 text-[0.5rem] md:text-[8px]  uppercase tracking-widest font-bold flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* --- LEFT COLUMN: CONFIGURATION CARDS --- */}
          <div className="order-2 lg:order-1 lg:col-span-5 space-y-6">
            
            {/* 1. DELIVERY LOCATION */}
            <div className={`bg-white border border-gray-100 rounded-lg md:rounded-[1rem] shadow-sm p-5 md:p-8 ${!isLoggedIn ? 'opacity-50 pointer-events-none' : ''}`}>
              <h2 className="text-[10px] md:text-xs lg:text-sm font-black uppercase mb-4 flex items-center gap-2 text-[#3BB77E] tracking-widest">
                <Navigation size={16} /> 1. Delivery Location
              </h2>
              <div className="flex bg-gray-50 p-1 rounded-lg mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                <TabBtn active={deliveryType === "address"} onClick={() => setDeliveryType("address")} icon={<MapPin size={14}/>} label="Saved" />
                <TabBtn active={deliveryType === "new"} onClick={() => setDeliveryType("new")} icon={<PlusCircle size={14}/>} label="New" />
                <TabBtn active={deliveryType === "map"} onClick={() => setDeliveryType("map")} icon={<MapIcon size={14}/>} label="Map" />
                <TabBtn active={deliveryType === "pickup"} onClick={() => setDeliveryType("pickup")} icon={<Store size={14}/>} label="Pickup" />
              </div>

              <div className="min-h-[120px]">
                {deliveryType === "address" && (
                  <div className="space-y-3 animate-in fade-in">
                    {addresses.map((addr: any) => (
                      <div key={addr.id} onClick={() => setSelectedAddress(addr.id)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-[#3BB77E] bg-[#F0FDF4]' : 'border-gray-50'}`}>
                        <p className="font-black text-[10px] md:text-xs uppercase tracking-tight">{addr.estate}</p>
                        <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase">Hse {addr.houseNumber}, {addr.county}</p>
                      </div>
                    ))}
                  </div>
                )}
                {deliveryType === "new" && (
                  <div className="space-y-4 animate-in slide-in-from-top-2">
                    <BrandedInput color="#3BB77E" icon={<Home size={16}/>} label="Detailed Address" placeholder="Estate, Street, House No." />
                  </div>
                )}
                {deliveryType === "map" && (
                  <div className="bg-gray-50 rounded-lg h-32 flex flex-col items-center justify-center border border-dashed border-gray-200">
                    <MapIcon className="text-gray-300 mb-2" size={24} />
                    <button className="text-[#3BB77E] text-[10px] md:text-xs font-black uppercase underline tracking-widest">Pin on Map</button>
                  </div>
                )}
                {deliveryType === "pickup" && (
                  <div className="p-4 rounded-lg border-2 border-[#3BB77E] bg-[#F0FDF4]">
                    <p className="text-xs md:text-sm font-black uppercase tracking-tight">Ruiru Hub Station</p>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase">Ruiru Bypass, Kiambu</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. PAYMENT DETAILS */}
            <div className={`bg-white border border-gray-100 rounded-2xl md:rounded-[1rem] shadow-sm p-5 md:p-8 ${!isLoggedIn ? 'opacity-50' : ''}`}>
              <h2 className="text-[10px] md:text-xs lg:text-sm font-black uppercase mb-4 flex items-center gap-2 text-[#3BB77E] tracking-widest">
                <CreditCard size={16} /> 2. Payment Details
              </h2>
              <div className="grid grid-cols-4 gap-2 mb-6">
                <PaymentMiniBtn active={paymentMethod === "mpesa"} onClick={() => setPaymentMethod("mpesa")} label="M-Pesa" logo="/Mpesa-Logo.png" />
                <PaymentMiniBtn active={paymentMethod === "card"} onClick={() => setPaymentMethod("card")} label="Card" logo="/Mastercard-Logo.png" />
                <PaymentMiniBtn active={paymentMethod === "airtel"} onClick={() => setPaymentMethod("airtel")} label="Airtel" logo="/Airtel-Logo.webp" />
                <PaymentMiniBtn active={paymentMethod === "cash"} onClick={() => setPaymentMethod("cash")} label="Cash" icon={<Banknote size={16}/>} />
              </div>

              <div className="pt-4 border-t border-gray-50">
                {paymentMethod === "mpesa" && <BrandedInput color="#3BB77E" icon={<Smartphone size={20} />} label="M-Pesa Number" placeholder="07XX XXX XXX" />}
                {paymentMethod === "airtel" && <BrandedInput color="#FF0000" icon={<Smartphone size={20} />} label="Airtel Number" placeholder="07XX XXX XXX" />}
                {paymentMethod === "card" && (
                  <div className="space-y-4 animate-in fade-in">
                    <BrandedInput color="#253D4E" icon={<User size={20} />} label="Holder" placeholder="Full Name" />
                    <BrandedInput color="#253D4E" icon={<CreditCard size={20} />} label="Number" placeholder="**** **** **** ****" />
                    <div className="grid grid-cols-2 gap-4">
                        {/* SPECIALIZED EXPIRY INPUT WITH / DISTINCTION */}
                        <div className="space-y-2">
                          <label className="text-[8px] md:text-[10px] lg:text-xs font-black uppercase text-gray-300 tracking-widest ml-1 leading-none">Expiry Date</label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253D4E]">
                              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <input 
                              type="text" 
                              maxLength={7}
                              placeholder="MM / YY" 
                              onChange={(e) => {
                                let v = e.target.value.replace(/\D/g, '');
                                if (v.length > 2) v = v.substring(0, 2) + ' / ' + v.substring(2, 4);
                                e.target.value = v;
                              }}
                              className="w-full pl-12 md:pl-14 pr-4 py-3 md:py-5 lg:py-6 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl text-[10px] md:text-sm lg:text-base font-bold outline-none focus:border-[#3BB77E] transition-all tracking-[0.1em]" 
                            />
                          </div>
                        </div>
                        <BrandedInput color="#253D4E" icon={<ShieldCheck size={20} />} label="CVV" placeholder="***" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. SHIPPING METHOD */}
            <div className="bg-white border border-gray-100 rounded-2xl md:rounded-[1rem] shadow-sm p-5 md:p-8">
              <h2 className="text-[10px] md:text-xs lg:text-sm font-black uppercase mb-4 flex items-center gap-2 text-[#3BB77E] tracking-widest">
                <Truck size={16} /> 3. Shipping Speed
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShippingSpeed("standard")} className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${shippingSpeed === "standard" ? 'border-[#3BB77E] bg-[#F0FDF4]' : 'border-gray-50'}`}>
                  <Clock size={20} className={shippingSpeed === "standard" ? 'text-[#3BB77E]' : 'text-gray-300'} />
                  <span className="text-[10px] md:text-xs font-black uppercase mt-2">Standard</span>
                </button>
                <button onClick={() => setShippingSpeed("express")} className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${shippingSpeed === "express" ? 'border-[#3BB77E] bg-[#F0FDF4]' : 'border-gray-50'}`}>
                  <FastForward size={20} className={shippingSpeed === "express" ? 'text-[#3BB77E]' : 'text-gray-300'} />
                  <span className="text-[10px] md:text-xs font-black uppercase mt-2">Express</span>
                </button>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: REWARDS & SUMMARY --- */}
          <div className="order-1 lg:order-2 lg:col-span-7 space-y-6 lg:sticky lg:top-24">
            {isLoggedIn && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                <div onClick={() => setUseWallet(!useWallet)} className={`p-5 rounded-[1.5rem] md:rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between ${useWallet ? 'border-[#3BB77E] bg-[#F0FDF4]' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <Wallet className="text-[#3BB77E] w-5 h-5 md:w-6 md:h-6" />
                    <div><p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400">Wallet</p><p className="text-[11px] md:text-base font-black">KES {walletBalance.toLocaleString()}</p></div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${useWallet ? 'border-[#3BB77E] bg-[#3BB77E]' : 'border-gray-200'}`}>{useWallet && <div className="w-2 h-2 bg-white rounded-full"/>}</div>
                </div>
                <div onClick={() => setUsePoints(!usePoints)} className={`p-5 rounded-[1.5rem] md:rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between ${usePoints ? 'border-orange-500 bg-orange-50' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <Coins className="text-orange-500 w-5 h-5 md:w-6 md:h-6" />
                    <div><p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400">Loyalty</p><p className="text-[11px] md:text-base font-black">{loyaltyPoints.toLocaleString()} Pts</p></div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${usePoints ? 'border-orange-500 bg-orange-500' : 'border-gray-200'}`}>{usePoints && <div className="w-2 h-2 bg-white rounded-full"/>}</div>
                </div>
              </div>
            )}

            <section className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[1rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="bg-[#f8fbf9] p-3 md:p-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-black uppercase text-xs md:text-sm sm:text-xl tracking-widest text-[#253D4E]">Order Review</h3>
                <ShoppingBag className="text-[#3BB77E] w-6 h-6 md:w-6 md:h-6" />
              </div>
              
              <div className="p-6 md:p-12 flex-1 flex flex-col">
                <div className="space-y-6 mb-8 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 md:gap-8">
                      <div className="relative w-12 h-12 md:w-20 md:h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                        <Image src={item.images?.[0]?.image || "/placeholder.webp"} alt={item.title} fill className="object-contain p-2" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-[#253D4E] uppercase text-[10px] md:text-base lg:text-lg truncate leading-tight">{item.title}</h4>
                        <p className="text-[9px] md:text-xs lg:text-sm text-[#3BB77E] font-black mt-1 tracking-tighter">{item.qty} × KES {parseFloat(item.price).toLocaleString()}</p>
                      </div>
                      <p className="font-black text-[#253D4E] text-[10px] md:text-base lg:text-lg whitespace-nowrap">KES {(parseFloat(item.price) * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#fcfdfd] border border-gray-100 rounded-[1rem] md:rounded-[1rem] p-4 md:p-5 space-y-2 mt-auto shadow-inner">
                  <div className="flex justify-between text-[9px] md:text-xs lg:text-sm font-bold text-gray-400 lowercase tracking-widest"><span>Subtotal</span><span className="text-[#253D4E]">KES {subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-[9px] md:text-xs lg:text-sm font-bold text-[#3BB77E] uppercase tracking-widest"><span>Delivery</span><span>KES {SHIPPING_FEE.toLocaleString()}</span></div>
                  
                  {usePoints && (
                    <div className="flex justify-between text-[9px] md:text-xs lg:text-sm font-bold text-orange-500 lowercase tracking-widest animate-in slide-in-from-left-1"><span>Pts Discount</span><span>- KES {pointsDiscount.toLocaleString()}</span></div>
                  )}
                  {useWallet && (
                    <div className="flex justify-between text-[9px] md:text-xs lg:text-sm font-bold text-[#3BB77E] uppercase tracking-widest animate-in slide-in-from-left-1"><span>Wallet Credit</span><span>- KES {walletDeduction.toLocaleString()}</span></div>
                  )}

                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <span className="font-black uppercase text-[10px] md:text-lg lg:text-xl tracking-widest text-[#253D4E]">Final Total</span>
                    <span className="text-2xl md:text-4xl lg:text-2xl font-black text-[#3BB77E]">KES {finalPayable.toLocaleString()}</span>
                  </div>
                  
                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={isPlacingOrder || !isLoggedIn} 
                    className="w-full md:w-3/4 md:mx-auto bg-[#3BB77E] hover:bg-[#253D4E] text-white font-black uppercase text-[0.6rem] md:text-xs tracking-[0.1em] py-3 md:py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 mt-4 transition-all hover:scale-[1.01] active:scale-95"
                  >
                    {isPlacingOrder ? "Processing..." : <>Confirm Order <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /></>}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- RESPONSIVE HELPERS ---

function BrandedInput({ color, icon, label, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[8px] md:text-[10px] lg:text-xs font-black uppercase text-gray-300 tracking-widest ml-1 leading-none">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: color }}>{React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4 md:w-5 md:h-5" })}</div>}
        <input type="text" placeholder={placeholder} className={`w-full ${icon ? 'pl-12 md:pl-14' : 'px-4 md:px-6'} pr-4 py-3 md:py-5 lg:py-6 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl text-[10px] md:text-sm lg:text-base font-bold outline-none focus:border-[#3BB77E] transition-all`} />
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 md:py-3 lg:py-4 rounded-lg md:rounded-xl transition-all text-[8px] md:text-[10px] lg:text-xs font-black uppercase tracking-widest whitespace-nowrap ${active ? 'bg-white text-[#3BB77E] shadow-sm' : 'text-gray-400'}`}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-3 h-3 md:w-4 md:h-4" })} {label}
    </button>
  );
}

function PaymentMiniBtn({ active, onClick, label, logo, icon }: any) {
  return (
    <div onClick={onClick} className={`p-2 md:p-3 lg:p-4 rounded-lg md:rounded-xl lg:rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-1 h-14 md:h-20 lg:h-24 ${active ? 'border-[#3BB77E] bg-[#F0FDF4]' : 'border-gray-50 bg-gray-50/50'}`}>
      {logo ? <img src={logo} className="h-3 md:h-5 lg:h-8 w-auto object-contain" alt={label} /> : icon && React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4 md:w-6 md:h-6" })}
      <span className={`text-[6px] md:text-[8px] lg:text-[10px] font-black uppercase tracking-tighter leading-none ${active ? 'text-[#3BB77E]' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}