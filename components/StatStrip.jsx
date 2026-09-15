const STATS = [
  { value: "2.8M", label: "labeled flows" },
  { value: "78", label: "flow features" },
  { value: "3", label: "models compared" },
  { value: "99%+", label: "Random Forest accuracy" },
];

export default function StatStrip() {
  return (
    <div className="border-y border-line">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={
              "py-8 px-2 sm:px-6 " +
              (i > 0 ? "sm:border-l border-line" : "") +
              (i % 2 === 1 ? " border-l border-line sm:border-l" : "")
            }
          >
            <div className="font-display text-3xl font-medium text-ink">{s.value}</div>
            <div className="text-sm text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
