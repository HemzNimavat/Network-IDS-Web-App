"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, Loader2, Info } from "lucide-react";

export default function PredictionForm() {
  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("heuristic");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/predict")
      .then((r) => r.json())
      .then((data) => {
        setFields(data.topDemoFeatures || []);
        setMode(data.mode || "heuristic");
        const initial = {};
        (data.topDemoFeatures || []).forEach((f) => {
          initial[f] = data.medians?.[f] ?? 0;
        });
        setValues(initial);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load the model configuration.");
        setLoading(false);
      });
  }, []);

  function handleChange(field, val) {
    setValues((prev) => ({ ...prev, [field]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: values }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Prediction failed.");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted font-mono text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> loading model configuration…
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
      <form onSubmit={handleSubmit} className="border border-line bg-panel">
        <div className="px-5 py-3 border-b border-line flex items-center justify-between">
          <span className="font-mono text-xs text-muted">flow_inspector.form</span>
          {mode === "heuristic" && (
            <span className="flex items-center gap-1.5 text-xs font-mono text-alert">
              <Info className="w-3.5 h-3.5" /> heuristic demo mode
            </span>
          )}
        </div>
        <div className="divide-y divide-line">
          {fields.map((field) => (
            <label key={field} className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="text-sm text-muted">{field}</span>
              <input
                type="number"
                step="any"
                value={values[field] ?? ""}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-36 bg-bg border border-line rounded px-3 py-1.5 text-sm font-mono text-ink text-right focus:outline-none focus:border-signal"
              />
            </label>
          ))}
        </div>
        <div className="px-5 py-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-signal text-bg font-medium py-3 rounded hover:bg-signal/90 transition-colors disabled:opacity-60"
          >
            {submitting ? "Analyzing flow…" : "Classify this flow"}
          </button>
        </div>
      </form>

      <div className="border border-line bg-panel min-h-[220px] flex flex-col">
        <div className="px-5 py-3 border-b border-line font-mono text-xs text-muted">
          verdict
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          {error && <p className="text-alert text-sm font-mono text-center">{error}</p>}
          {!error && !result && (
            <p className="text-muted text-sm text-center">
              Submit the form to classify a flow.
            </p>
          )}
          {result && (
            <div className="text-center">
              {result.prediction === "BENIGN" ? (
                <ShieldCheck className="w-14 h-14 text-safe mx-auto mb-4" strokeWidth={1.5} />
              ) : (
                <ShieldAlert className="w-14 h-14 text-alert mx-auto mb-4" strokeWidth={1.5} />
              )}
              <div
                className={
                  "font-display text-3xl mb-1 " +
                  (result.prediction === "BENIGN" ? "text-safe" : "text-alert")
                }
              >
                {result.prediction}
              </div>
              {result.confidence !== null && (
                <div className="text-muted font-mono text-sm">
                  {result.confidence}% confidence
                </div>
              )}
              {result.note && (
                <p className="text-muted text-xs mt-4 max-w-xs mx-auto leading-relaxed">
                  {result.note}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
