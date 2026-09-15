"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function FeatureImportanceChart({ data }) {
  const sorted = [...data].sort((a, b) => a.importance - b.importance);
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
      >
        <CartesianGrid stroke="#24314A" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: "#7C8AA6", fontSize: 11, fontFamily: "var(--font-mono)" }}
          axisLine={{ stroke: "#24314A" }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="feature"
          width={190}
          tick={{ fill: "#DCE4F0", fontSize: 11, fontFamily: "var(--font-mono)" }}
          axisLine={{ stroke: "#24314A" }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#121B2E",
            border: "1px solid #24314A",
            borderRadius: 4,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
          }}
          labelStyle={{ color: "#DCE4F0" }}
        />
        <Bar dataKey="importance" radius={[0, 2, 2, 0]}>
          {sorted.map((_, i) => (
            <Cell key={i} fill="#5EA8FF" fillOpacity={0.55 + (i / sorted.length) * 0.45} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
