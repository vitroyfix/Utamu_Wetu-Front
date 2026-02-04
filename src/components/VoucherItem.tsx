"use client";
import React from "react";
import { Ticket } from "lucide-react";

interface VoucherItemProps {
  voucher: {
    id: string;
    code: string;
    discountAmount: number;
    expiryDate: string;
  };
  onApply: (code: string) => void;
  isApplying: boolean;
}

export const VoucherItem = ({ voucher, onApply, isApplying }: VoucherItemProps) => {
  return (
    <button 
      onClick={() => onApply(voucher.code)}
      disabled={isApplying}
      className="bg-white p-6 rounded-[1rem] border-2 border-dashed border-[#3BB77E]/20 flex flex-col justify-between h-40 text-left hover:border-[#3BB77E] transition-all group active:scale-95 disabled:opacity-50 shadow-sm w-full"
    >
      <div className="flex justify-between items-start">
        <div className="p-2 bg-[#3BB77E]/10 rounded-lg text-[#3BB77E] group-hover:bg-[#3BB77E] group-hover:text-white transition-colors">
          <Ticket size={24}/>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-[#3BB77E] block">{voucher.discountAmount}% OFF</span>
          <span className="text-[8px] font-bold text-gray-400 uppercase">Limited Time</span>
        </div>
      </div>
      
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-[#253D4E]">{voucher.code}</p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-[9px] font-bold text-gray-400 uppercase">
            {isApplying ? "Activating..." : "Tap to activate"}
          </p>
          <p className="text-[8px] font-medium text-gray-300">
            Exp: {new Date(voucher.expiryDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </button>
  );
};