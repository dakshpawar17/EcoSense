import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "emerald" | "amber" | "rose" | "blue" | "slate";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "emerald", size = "md" }) => {
  const styles = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    blue: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    slate: "bg-slate-800 text-slate-300 border-slate-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${styles[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
