import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";

interface ComparisonBarChartProps {
  userAverage: number;
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({ userAverage }) => {
  const data = [
    { name: "Eco Target", value: 5.0, color: "#10B981" },
    { name: "Your Average", value: userAverage || 9.5, color: "#3B82F6" },
    { name: "Natl Average", value: 12.5, color: "#F59E0B" },
    { name: "Global High", value: 20.0, color: "#EF4444" },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
          />
          <YAxis
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${val}kg`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0F172A",
              borderColor: "#334155",
              borderRadius: "0.75rem",
              color: "#F8FAFC",
              fontSize: "12px",
            }}
            formatter={(val: number) => [`${val} kg CO₂/day`, "Daily Footprint"]}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
