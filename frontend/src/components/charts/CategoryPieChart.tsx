import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface CategoryPieChartProps {
  breakdown: {
    co2Transport: number;
    co2Energy: number;
    co2Food: number;
    co2Shopping: number;
    co2Total: number;
  };
}

const COLORS = {
  Transport: "#3B82F6", // Blue
  Energy: "#F59E0B",    // Amber
  Food: "#10B981",      // Emerald
  Shopping: "#8B5CF6",  // Purple
};

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ breakdown }) => {
  const data = [
    { name: "Transport", value: breakdown.co2Transport, color: COLORS.Transport },
    { name: "Energy", value: breakdown.co2Energy, color: COLORS.Energy },
    { name: "Food", value: breakdown.co2Food, color: COLORS.Food },
    { name: "Shopping", value: breakdown.co2Shopping, color: COLORS.Shopping },
  ].filter((item) => item.value > 0);

  const displayData = data.length > 0 ? data : [
    { name: "Transport", value: 3.5, color: COLORS.Transport },
    { name: "Energy", value: 2.8, color: COLORS.Energy },
    { name: "Food", value: 4.2, color: COLORS.Food },
    { name: "Shopping", value: 2.0, color: COLORS.Shopping },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#0F172A",
              borderColor: "#334155",
              borderRadius: "0.75rem",
              color: "#F8FAFC",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`${value.toFixed(2)} kg CO₂`, "Emissions"]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-slate-300 text-xs font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
