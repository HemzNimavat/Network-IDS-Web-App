"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  Accuracy: "#5EA8FF",
  "Precision (macro)": "#37D6B0",
  "Recall (macro)": "#FF7A59",
  "F1-score (macro)": "#DCE4F0",
};

export default function MetricsBarChart({ results }) {
  const data = results.map((r) => ({
    Model: r.Model,
    Accuracy: r.Accuracy,
    "Precision (macro)": r["Precision (macro)"],
    "Recall (macro)": r["Recall (macro)"],
    "F1-score (macro)": r["F1-score (macro)"],
  }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#24314A" vertical={false} />
        <XAxis
          dataKey="Model"
          tick={{ fill: "#7C8AA6", fontSize: 12, fontFamily: "var(--font-mono)" }}
          axisLine={{ stroke: "#24314A" }}
          tickLine={false}
        />
        <YAxis
          domain={[0.85, 1]}
          tick={{ fill: "#7C8AA6", fontSize: 12, fontFamily: "var(--font-mono)" }}
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
        <Legend wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: 12 }} />
        {Object.keys(COLORS).map((key) => (
          <Bar key={key} dataKey={key} fill={COLORS[key]} radius={[2, 2, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
