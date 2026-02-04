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
  Truck, FastForward, Clock, PlusCircle, Wallet, Coins, 
  Home, Trash2, Info, Ticket, ArrowLeft
} from "lucide-react";
import { GET_USER_PROFILE, CREATE_ORDER, APPLY_VOUCHER } from "../../lib/queries";

// --- CUSTOM REUSABLE HOOK ---
function useUserRewards(user: any) {
  const walletBalance = user?.balance || 0;
  const loyaltyPoints = user?.coins || 0;
  const calculatePointsValue = (pts: number) => (pts / 100) * 10;

  return {
    walletBalance,
    loyaltyPoints,
    calculatePointsValue,
    hasWallet: walletBalance > 0,
    hasPoints: loyaltyPoints > 0
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [deliveryType, setDeliveryType] = useState<"address" | "pickup" | "map" | "new">("address");
  const [shippingSpeed, setShippingSpeed] = useState<string>("standard");
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("mpesa");
  const [cartItems, setcartItems] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [passedTotals, setPassedTotals] = useState<any>(null);
  
  // Promo State
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);

  // --- API HOOKS ---
  const { data: profileData } = useQuery(GET_USER_PROFILE, { skip: !isLoggedIn });
  const [createOrder, { loading: isPlacingOrder }] = useMutation(CREATE_ORDER);
  const [applyVoucher, { loading: isApplyingPromo }] = useMutation(APPLY_VOUCHER);

  // FIX: Type assertions to 'any' resolve build errors for property access
  const { walletBalance, loyaltyPoints, calculatePointsValue } = useUserRewards((profileData as any)?.me);
  const addresses = (profileData as any)?.me?.addresses || [];

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    checkAuth();

    const sessionData = localStorage.getItem("checkout_session");
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      setcartItems(parsed.items || []);
      setPassedTotals(parsed.totals || null);
    } else {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) setcartItems(JSON.parse(savedCart));
    }

    setIsMounted(true);
    window.addEventListener("authChanged", checkAuth);
    return () => window.removeEventListener("authChanged", checkAuth);
  }, []);

  // --- PROMO LOGIC ---
  const handleApplyPromo = async () => {
    if (!promoCode) return;
    try {
      const { data } = await applyVoucher({ variables: { code: promoCode } });
      
      // FIX: Assert 'data' as 'any' to allow access to mutation result properties
      if ((data as any)?.applyVoucher?.success) {
        alert((data as any).applyVoucher.message);
        setPromoDiscount(50); 
      } else {
        alert((data as any)?.applyVoucher?.message || "Invalid Code");
      }
    } catch (err) { alert("Error applying promo"); }
  };

  // --- DELETE FUNCTIONALITY ---
  const removeItem = (id: number) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setcartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    if (localStorage.getItem("checkout_session")) {
      const session = JSON.parse(localStorage.getItem("checkout_session")!);
      session.items = updatedItems;
      localStorage.setItem("checkout_session", JSON.stringify(session));
    }
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.qty), 0);
  
  const BASE_SHIPPING = passedTotals ? parseFloat(passedTotals.shipping) : 150.00;
  const SHIPPING_FEE = shippingSpeed === "express" ? BASE_SHIPPING + 200 : BASE_SHIPPING;
  
  const vatAmount = subtotal * 0.16;
  const SERVICE_FEE = passedTotals ? parseFloat(passedTotals.service) : 50.00;
  const pointsDiscount = usePoints ? calculatePointsValue(loyaltyPoints) : 0;
  
  let preWalletTotal = (subtotal + vatAmount + SHIPPING_FEE + SERVICE_FEE) - (pointsDiscount + promoDiscount);
  const walletDeduction = useWallet ? Math.min(walletBalance, preWalletTotal) : 0;
  const finalPayable = Math.max(0, preWalletTotal - walletDeduction);

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) return alert("Please log in to complete your order.");
    if (deliveryType === "address" && !selectedAddress) return alert("Please select a delivery address.");
    if (cartItems.length === 0) return alert("Your cart is empty.");

    try {
      const itemsJson = JSON.stringify(cartItems.map(item => ({ id: item.id, qty: item.qty })));
      const { data } = await createOrder({ 
        variables: { addressId: selectedAddress || 1, itemsJson } 
      });
      
      // FIX: Assert 'data' as 'any' for production build access
      if ((data as any)?.createOrder?.order) {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("checkout_session");
        window.dispatchEvent(new Event("cartUpdated"));
        router.push(`/order-success?orderNumber=${(data as any).createOrder.order.orderNumber}`);
      }
    } catch (err) { alert("Checkout failed."); }
  };

  if (!isMounted) return null;

  return (
    <div className="bg-[#fcfdfd] min-h-screen font-sans text-[#253D4E] pb-10">
      <div className="bg-[#3BB77E] py-4 md:py-8 lg:py-12 shadow-sm mb-6">
        <div className="container mx-auto px-4">
          <h1 className="text-xl md:text-1xl lg:text-2xl font-black text-white uppercase tracking-tight mb-2">Checkout</h1>
          <nav className="text-white/80 text-[0.5rem] md:text-[8px] uppercase tracking-widest font-bold flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <div className="order-2 lg:order-1 lg:col-span-5 space-y-6">
              <div className={`bg-white border border-green-100 rounded-lg md:rounded-[1rem] shadow-sm p-5 md:p-8 ${!isLoggedIn ? 'opacity-50 pointer-events-none' : ''}`}>
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
                  {deliveryType === "new" && <BrandedInput color="#3BB77E" icon={<Home size={16}/>} label="Detailed Address" placeholder="Estate, Street, House No." />}
                  {deliveryType === "pickup" && (
                    <div className="p-4 rounded-lg border-2 border-[#3BB77E] bg-[#F0FDF4]">
                      <p className="text-xs md:text-sm font-black uppercase tracking-tight">Ruiru Hub Station</p>
                      <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase">Ruiru Bypass, Kiambu</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={`bg-white border border-green-100 rounded-2xl md:rounded-[1rem] shadow-sm p-5 md:p-8 ${!isLoggedIn ? 'opacity-50' : ''}`}>
                <h2 className="text-[10px] md:text-xs lg:text-sm font-black uppercase mb-4 flex items-center gap-2 text-[#3BB77E] tracking-widest">
                  <CreditCard size={16} /> 2. Payment Details
                </h2>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <PaymentMiniBtn active={paymentMethod === "mpesa"} onClick={() => setPaymentMethod("mpesa")} label="M-Pesa" logo="/Mpesa-Logo.png" />
                  <PaymentMiniBtn active={paymentMethod === "card"} onClick={() => setPaymentMethod("card")} label="Card" logo="/Mastercard-Logo.png" />
                  <PaymentMiniBtn active={paymentMethod === "airtel"} onClick={() => setPaymentMethod("airtel")} label="Airtel" logo="/Airtel-Logo.webp" />
                  <PaymentMiniBtn active={paymentMethod === "cash"} onClick={() => setPaymentMethod("cash")} label="Cash" icon={<Banknote size={16}/>} />
                </div>
                <div className="pt-4 border-t border-green-50">
                  {(paymentMethod === "mpesa" || paymentMethod === "airtel") && (
                    <BrandedInput color={paymentMethod === "mpesa" ? "#3BB77E" : "#FF0000"} icon={<Smartphone size={20} />} label="Mobile Number" placeholder="07XX XXX XXX" />
                  )}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <BrandedInput color="#3BB77E" icon={<User size={20} />} label="Cardholder Name" placeholder="Full Name" />
                      <BrandedInput color="#3BB77E" icon={<CreditCard size={20} />} label="Card Number" placeholder="**** **** **** ****" />
                      <div className="grid grid-cols-2 gap-4">
                          <BrandedInput color="#3BB77E" icon={<Calendar size={20} />} label="Expiry" placeholder="MM/YY" />
                          <BrandedInput color="#3BB77E" icon={<ShieldCheck size={20} />} label="CVV" placeholder="***" />
                      </div>
                    </div>
                  )}
                  {paymentMethod === "cash" && (
                    <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                      <Info size={18} className="text-blue-500 mt-0.5" />
                      <p className="text-[9px] md:text-[10px] font-bold text-blue-700 uppercase">Cash on delivery selected.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-green-100 rounded-2xl md:rounded-[1rem] shadow-sm p-5 md:p-8">
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

            <div className="order-1 lg:order-2 lg:col-span-7 space-y-6 lg:sticky lg:top-24">
              {isLoggedIn && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div onClick={() => setUseWallet(!useWallet)} className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all flex items-center justify-between ${useWallet ? 'border-[#3BB77E] bg-[#F0FDF4]' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <Wallet className="text-[#3BB77E] w-5 h-5 md:w-6 md:h-6" />
                      <div><p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400">Wallet</p><p className="text-[11px] md:text-base font-black">KES {walletBalance.toLocaleString()}</p></div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${useWallet ? 'border-[#3BB77E] bg-[#3BB77E]' : 'border-gray-200'}`}>{useWallet && <div className="w-2 h-2 bg-white rounded-full"/>}</div>
                  </div>
                  <div onClick={() => setUsePoints(!usePoints)} className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all flex items-center justify-between ${usePoints ? 'border-orange-500 bg-orange-50' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <Coins className="text-orange-500 w-5 h-5 md:w-6 md:h-6" />
                      <div><p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400">Loyalty</p><p className="text-[11px] md:text-base font-black">{loyaltyPoints.toLocaleString()} Pts</p></div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${usePoints ? 'border-orange-500 bg-orange-500' : 'border-gray-200'}`}>{usePoints && <div className="w-2 h-2 bg-white rounded-full"/>}</div>
                  </div>
                </div>
              )}

              <section className="bg-white border border-green-100 rounded-[1rem] shadow-2xl overflow-hidden flex flex-col">
                <div className="bg-[#f8fbf9] p-3 md:p-5 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-black uppercase text-xs md:text-sm tracking-widest text-[#253D4E]">Order Review</h3>
                  <ShoppingBag className="text-[#3BB77E] w-6 h-6" />
                </div>
                
                <div className="p-6 md:p-12 flex-1 flex flex-col">
                  <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 md:gap-8 group relative">
                        <div className="relative w-12 h-12 md:w-20 md:h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                          <Image src={item.images?.[0]?.image || "/placeholder.webp"} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-[#253D4E] uppercase text-[10px] md:text-base truncate leading-tight">{item.title}</h4>
                          <p className="text-[9px] md:text-xs text-[#3BB77E] font-black mt-1">{item.qty} × KES {parseFloat(item.price).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="font-black text-[#253D4E] text-[10px] md:text-base whitespace-nowrap">KES {(parseFloat(item.price) * item.qty).toLocaleString()}</p>
                          <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Apply Promo Code</p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3BB77E] w-4 h-4" />
                        <input 
                          type="text" 
                          value={promoCode} 
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="ENTER CODE" 
                          className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none focus:border-[#3BB77E]" 
                        />
                      </div>
                      <button 
                        onClick={handleApplyPromo}
                        disabled={isApplyingPromo || !promoCode}
                        className="bg-[#253D4E] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#3BB77E] transition-colors disabled:opacity-50"
                      >
                        {isApplyingPromo ? "..." : "Apply"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#fcfdfd] border border-gray-100 rounded-[1rem] p-4 md:p-5 space-y-2 mt-auto shadow-inner">
                    <div className="flex justify-between text-[9px] md:text-xs font-bold text-gray-400 tracking-widest"><span>Subtotal</span><span className="text-[#253D4E]">KES {subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[9px] md:text-xs font-bold text-[#3BB77E] uppercase"><span>Delivery ({shippingSpeed})</span><span>KES {SHIPPING_FEE.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[9px] md:text-xs font-bold text-gray-400 tracking-widest"><span>VAT (16%)</span><span className="text-[#253D4E]">KES {vatAmount.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[9px] md:text-xs font-bold text-gray-400 tracking-widest"><span>Service Fee</span><span className="text-[#253D4E]">KES {SERVICE_FEE.toLocaleString()}</span></div>
                    
                    {promoDiscount > 0 && <div className="flex justify-between text-[9px] md:text-xs font-bold text-blue-500 uppercase"><span>Promo Code</span><span>- KES {promoDiscount.toLocaleString()}</span></div>}
                    {usePoints && <div className="flex justify-between text-[9px] md:text-xs font-bold text-orange-500 uppercase"><span>Loyalty Discount</span><span>- KES {pointsDiscount.toLocaleString()}</span></div>}
                    {useWallet && <div className="flex justify-between text-[9px] md:text-xs font-bold text-[#3BB77E] uppercase"><span>Wallet Used</span><span>- KES {walletDeduction.toLocaleString()}</span></div>}

                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                      <span className="font-black uppercase text-[10px] md:text-lg tracking-widest text-[#253D4E]">Final Total</span>
                      <span className="text-2xl md:text-3xl font-black text-[#3BB77E]">KES {finalPayable.toLocaleString()}</span>
                    </div>
                    
                    <button onClick={handlePlaceOrder} disabled={isPlacingOrder || !isLoggedIn} className="w-full bg-[#3BB77E] hover:bg-[#253D4E] text-white font-black uppercase text-[0.6rem] md:text-xs tracking-[0.1em] py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 mt-4 transition-all disabled:opacity-50">
                      {isPlacingOrder ? "Processing..." : <>Confirm Order <ArrowRight size={18} /></>}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm animate-in fade-in duration-500 max-w-2xl mx-auto">
            <div className="bg-[#def9ec] p-8 rounded-full mb-6 text-[#3BB77E]">
              <ShoppingBag size={64} />
            </div>
            <h2 className="text-[#253D4E] text-2xl md:text-3xl font-black mb-3 text-center">Checkout is Empty</h2>
            <p className="text-gray-400 font-medium mb-8 text-center px-4 max-w-md">
              You don't have any items in your checkout session. Head back to the shop to find some fresh groceries.
            </p>
            <Link href="/shop" className="bg-[#3BB77E] hover:bg-[#253D4E] text-white font-black px-10 py-4 rounded-2xl transition-all flex items-center gap-3">
              <ArrowLeft size={18} /> Back to Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function BrandedInput({ color, icon, label, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[8px] md:text-[10px] lg:text-xs font-black uppercase text-gray-300 tracking-widest ml-1 leading-none">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: color }}>
            {React.cloneElement(icon as any, { className: "w-4 h-4 md:w-5 md:h-5" })}
          </div>
        )}
        <input 
          type="text" 
          placeholder={placeholder} 
          className={`w-full ${icon ? 'pl-12 md:pl-14' : 'px-4 md:px-6'} pr-4 py-3 md:py-5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] md:text-sm font-bold outline-none transition-all focus:ring-1 focus:ring-offset-1`}
          style={{ borderColor: color, color: color }} 
        />
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all text-[8px] md:text-[10px] font-black uppercase tracking-widest ${active ? 'bg-white text-[#3BB77E] shadow-sm' : 'text-gray-400'}`}>
      {React.cloneElement(icon as any, { className: "w-3 h-3 md:w-4 md:h-4" })} {label}
    </button>
  );
}

function PaymentMiniBtn({ active, onClick, label, logo, icon }: any) {
  return (
    <div onClick={onClick} className={`p-2 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-1 h-14 md:h-20 ${active ? 'border-[#3BB77E] bg-[#F0FDF4]' : 'border-gray-50 bg-gray-50/50'}`}>
      {logo ? <img src={logo} className="h-3 md:h-5 w-auto object-contain" alt={label} /> : icon && React.cloneElement(icon as any, { className: "w-4 h-4 md:w-6 md:h-6" })}
      <span className={`text-[6px] md:text-[8px] font-black uppercase tracking-tighter ${active ? 'text-[#3BB77E]' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}