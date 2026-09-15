const STEPS = [
  {
    n: "1",
    title: "Capture",
    body: "Network flows are recorded from real traffic and summarized into ~78 statistical features per flow using CICFlowMeter.",
  },
  {
    n: "2",
    title: "Clean",
    body: "Infinite and missing values from flow-rate calculations are removed, along with identifier and constant columns.",
  },
  {
    n: "3",
    title: "Balance",
    body: "SMOTE oversampling corrects the natural imbalance between benign traffic and rare attack types, applied to training data only.",
  },
  {
    n: "4",
    title: "Train",
    body: "Random Forest, XGBoost, and an MLP are trained on the balanced data and compared on a held-out, untouched test set.",
  },
  {
    n: "5",
    title: "Detect",
    body: "The best-performing model classifies new flows in real time as BENIGN or ATTACK, as shown in the live demo.",
  },
];

export default function PipelineSteps() {
  return (
    <div className="grid sm:grid-cols-5 gap-px bg-line">
      {STEPS.map((s) => (
        <div key={s.n} className="bg-bg p-6">
          <div className="font-mono text-signal text-sm mb-4">{s.n}</div>
          <h3 className="font-display text-lg mb-2">{s.title}</h3>
          <p className="text-sm text-muted leading-relaxed">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
