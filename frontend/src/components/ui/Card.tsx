import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = "", glow = false, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 transition-all duration-300 ${
        glow ? "glow-emerald border-emerald-500/30" : "hover:border-slate-700/80"
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
};
