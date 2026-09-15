import { Fragment } from "react";

function cellShade(value, max) {
  const intensity = Math.min(value / max, 1);
  return intensity;
}

export default function ConfusionMatrix({ matrix, labels }) {
  const max = Math.max(...matrix.flat());

  return (
    <div className="inline-block">
      <div className="grid grid-cols-[100px_repeat(2,140px)] gap-px bg-line text-xs font-mono">
        <div className="bg-bg" />
        {labels.map((l) => (
          <div key={l} className="bg-bg px-3 py-2 text-muted text-center">
            pred: {l}
          </div>
        ))}
        {matrix.map((row, i) => (
          <Fragment key={`row-${i}`}>
            <div className="bg-bg px-3 py-6 text-muted flex items-center">
              actual: {labels[i]}
            </div>
            {row.map((val, j) => {
              const isDiagonal = i === j;
              const intensity = cellShade(val, max);
              return (
                <div
                  key={`${i}-${j}`}
                  className="px-3 py-6 flex items-center justify-center text-ink font-medium"
                  style={{
                    backgroundColor: isDiagonal
                      ? `rgba(55, 214, 176, ${0.15 + intensity * 0.55})`
                      : `rgba(255, 122, 89, ${0.1 + intensity * 0.55})`,
                  }}
                >
                  {val.toLocaleString()}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
