"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface ShopTypeData {
  name: string;
  count: number;
}

interface ShopTypeChartProps {
  data: ShopTypeData[];
}

// Field Notes design system colors
const COLORS = [
  "var(--accent-rust)",
  "var(--accent-terra)",
  "var(--accent-ochre)",
  "var(--accent-sage)",
];

export function ShopTypeChart({ data }: ShopTypeChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...data.map((d) => d.count));

  if (!mounted) {
    return (
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--paper)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-paper)",
        }}
      >
        <h3
          className="font-serif text-lg font-semibold mb-4"
          style={{ color: "var(--ink)" }}
        >
          Shop Type Distribution
        </h3>
        <div
          className="h-80 flex items-center justify-center text-sm"
          style={{ color: "var(--ink-muted)" }}
        >
          Loading chart...
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-paper)",
      }}
    >
      <h3
        className="font-serif text-lg font-semibold mb-4"
        style={{ color: "var(--ink)" }}
      >
        Shop Type Distribution
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="var(--border-light)"
            />
            <XAxis
              type="number"
              domain={[0, Math.ceil(maxCount * 1.1)]}
              tick={{ fill: "var(--ink-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border-light)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "var(--ink-light)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border-light)" }}
              width={100}
            />
            <Tooltip
              cursor={{ fill: "var(--paper-warm)" }}
              contentStyle={{
                backgroundColor: "var(--paper)",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-paper)",
              }}
              labelStyle={{ color: "var(--ink)", fontFamily: "var(--font-serif)" }}
              formatter={(value) => [`${value}`, "Count"]}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
              {sortedData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                fill="var(--ink-light)"
                fontSize={12}
                fontWeight={500}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
