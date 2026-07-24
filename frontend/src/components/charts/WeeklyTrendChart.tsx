import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface WeeklyTrendChartProps {
  data: Array<{
    date: string;
    co2Total: number;
    co2Transport: number;
    co2Energy: number;
    co2Food: number;
    co2Shopping: number;
  }>;
}

export const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({ data }) => {
  const chartData = data.length > 0 ? data : [
    { date: "Mon", co2Total: 14.2 },
    { date: "Tue", co2Total: 10.5 },
    { date: "Wed", co2Total: 8.8 },
    { date: "Thu", co2Total: 12.1 },
    { date: "Fri", co2Total: 9.4 },
    { date: "Sat", co2Total: 16.0 },
    { date: "Sun", co2Total: 7.2 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#64748B"
            fontSize={12}
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
            formatter={(val: number) => [`${val} kg CO₂`, "Total Footprint"]}
          />
          <Area
            type="monotone"
            dataKey="co2Total"
            stroke="#10B981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorCo2)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
