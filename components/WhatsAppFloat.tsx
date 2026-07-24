"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

const WA  = "8615986213212";
const MSG = encodeURIComponent("Hi! 👋 I'm interested in custom clothing manufacturing with Mulang Apparel. Can you help?");

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit ={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="w-72 rounded-2xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] border border-white/10"
          >
            {/* Header */}
            <div className="bg-[#25D366] px-5 py-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Mulang Apparel</p>
                  <p className="text-white/70 text-[0.68rem]">Typically replies in minutes</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white mt-0.5">
                <X size={16} />
              </button>
            </div>

            {/* Chat bubble */}
            <div className="bg-[#111] px-5 py-5">
              <div className="bg-[#1a1a1a] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-white/80 leading-relaxed mb-5">
                Hi 👋<br />
                Need Custom Apparel?<br />
                <span className="text-white/50 text-xs">Chat With Us On WhatsApp</span>
              </div>
              <a
                href={`https://wa.me/${WA}?text=${MSG}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white text-xs font-bold tracking-wider uppercase rounded-full hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={14} /> Start Chat
              </a>
              <p className="text-center text-white/25 text-[0.6rem] mt-3">+86 159 8621 3212</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB — direct jump to WhatsApp, long-press / right-click opens the info card */}
      <motion.a
        href={`https://wa.me/${WA}?text=${MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        onContextMenu={(e) => { e.preventDefault(); setOpen(!open); }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        {/* Breathing ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        {/* Unread badge */}
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">1</span>
        {/* Icon */}
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.494.651 4.838 1.788 6.875L2 30l7.344-1.766A13.924 13.924 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 01-5.83-1.594l-.418-.248-4.356 1.048 1.072-4.24-.273-.435A11.456 11.456 0 014.5 16C4.5 9.597 9.597 4.5 16 4.5S27.5 9.597 27.5 16 22.403 27.5 16 27.5zm6.29-8.605c-.345-.173-2.04-1.006-2.356-1.12-.315-.115-.545-.173-.774.173-.23.345-.888 1.12-1.09 1.35-.2.23-.4.26-.745.086-.345-.173-1.455-.536-2.77-1.71-1.024-.913-1.715-2.04-1.915-2.385-.2-.345-.021-.531.15-.703.155-.154.345-.403.518-.604.172-.202.23-.346.345-.576.115-.23.057-.432-.028-.605-.086-.172-.774-1.867-1.06-2.557-.28-.672-.563-.58-.774-.59-.2-.01-.43-.013-.66-.013-.23 0-.603.086-.92.432-.315.345-1.203 1.176-1.203 2.867 0 1.69 1.231 3.325 1.403 3.555.172.23 2.422 3.698 5.869 5.185.82.354 1.46.565 1.958.723.822.26 1.572.223 2.163.135.66-.098 2.04-.833 2.327-1.637.287-.805.287-1.494.2-1.637-.085-.144-.315-.23-.66-.403z"/>
        </svg>
      </motion.a>
    </div>
  );
}
