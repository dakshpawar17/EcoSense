import React from "react";
import { motion } from "framer-motion";

interface EcoScoreRingProps {
  score: number;
  grade: string;
  size?: number;
}

export const EcoScoreRing: React.FC<EcoScoreRingProps> = ({ score, grade, size = 180 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#10B981"; // Emerald
    if (s >= 60) return "#3B82F6"; // Blue
    if (s >= 40) return "#F59E0B"; // Amber
    return "#EF4444";             // Red
  };

  const getLabel = (g: string) => {
    switch (g) {
      case "A+":
        return "Eco Champion";
      case "A":
        return "Sustainability Leader";
      case "B":
        return "Low Footprint";
      case "C":
        return "Average Impact";
      case "D":
        return "High Emissions";
      default:
        return "Critical Impact";
    }
  };

  const strokeColor = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Contents */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold tracking-tight text-white font-sans"
          >
            {score}
          </motion.span>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
            EcoScore
          </span>
        </div>
      </div>

      {/* Grade Badge Pill */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-bold shadow-md"
          style={{ backgroundColor: `${strokeColor}20`, color: strokeColor, border: `1px solid ${strokeColor}40` }}
        >
          Grade {grade}
        </span>
        <span className="text-xs font-medium text-slate-400">{getLabel(grade)}</span>
      </div>
    </div>
  );
};
