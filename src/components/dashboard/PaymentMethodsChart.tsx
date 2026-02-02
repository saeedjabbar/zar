"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import type { ContentType } from "recharts/types/component/DefaultLegendContent";

interface PaymentMethodData {
  name: string;
  value: number;
  color: string;
}

interface PaymentMethodsChartProps {
  data: PaymentMethodData[];
  title?: string;
}

// Field Notes earthy color palette
const COLORS = [
  '#b85c38', // rust
  '#c67c4e', // terra
  '#c4a35a', // ochre
  '#5e7a65', // sage
  '#4a5568', // slate
  '#d4886a', // rust-light
  '#8fa996', // sage-light
  '#8a8279', // ink-muted
];

export function PaymentMethodsChart({ data, title }: PaymentMethodsChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const renderCustomLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

    if (
      typeof cx !== "number" ||
      typeof cy !== "number" ||
      typeof midAngle !== "number" ||
      typeof innerRadius !== "number" ||
      typeof outerRadius !== "number" ||
      typeof percent !== "number"
    ) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLegend: ContentType = (props: any) => {
    const { payload } = props;
    if (!payload) return null;

    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: { value: string; color?: string }, index: number) => {
          const dataItem = data.find((d) => d.name === entry.value);
          const percentage = dataItem
            ? ((dataItem.value / total) * 100).toFixed(1)
            : "0";

          return (
            <li key={`legend-${index}`} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm" style={{ color: "var(--ink-light)" }}>
                {String(entry.value)} ({percentage}%)
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

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
          {title ?? "Payment Methods Distribution"}
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
        {title ?? "Payment Methods Distribution"}
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                "Count",
              ]}
              contentStyle={{
                backgroundColor: "var(--paper)",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-paper)",
                color: "var(--ink)",
              }}
              labelStyle={{ color: "var(--ink)" }}
              itemStyle={{ color: "var(--ink-light)" }}
            />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export { COLORS as PAYMENT_CHART_COLORS };
