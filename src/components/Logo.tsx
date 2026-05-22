"use client";

import React from "react";
import { motion } from "framer-motion";

export function Logo() {
  return (
    <motion.div
      className="relative flex items-center justify-center cursor-pointer select-none"
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.93 }}
    >
      {/* Outer glow ring on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/0 via-orange-500/0 to-amber-500/0"
        whileHover={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Logo Icon Container */}
      <div className="relative w-9 h-9 flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 group">

        {/* Ambient radar pulse animation — behind icon */}
        <motion.span
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 opacity-60"
          animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 opacity-40"
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />

        {/* The Magnifying Glass SVG Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10 w-5 h-5"
        >
          {/* Main lens circle */}
          <circle cx="10.5" cy="10.5" r="6.5" />

          {/* Scan indicator dot — a small alert dot inside the lens */}
          <circle cx="10.5" cy="10.5" r="1.5" fill="white" stroke="none" />

          {/* Handle of magnifying glass */}
          <line x1="15.5" y1="15.5" x2="20" y2="20" strokeWidth="2.5" />
        </svg>
      </div>
    </motion.div>
  );
}
