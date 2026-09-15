import results from "@/data/results.json";
import confusionData from "@/data/confusion_matrices.json";
import aucScores from "@/data/auc_scores.json";
import featureImportance from "@/data/feature_importance.json";
import MetricsBarChart from "@/components/MetricsBarChart";
import FeatureImportanceChart from "@/components/FeatureImportanceChart";
import ConfusionMatrix from "@/components/ConfusionMatrix";

export const metadata = {
  title: "Results — IDS//",
};

function pct(v) {
  return (v * 100).toFixed(2) + "%";
}

export default function ResultsPage() {
  const best = [...results].sort((a, b) => b.Accuracy - a.Accuracy)[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="font-mono text-sm text-signal mb-4">evaluation · held-out test set</p>
      <h1 className="font-display text-4xl mb-4">Model comparison</h1>
      <p className="text-muted max-w-2xl mb-12 leading-relaxed">
        All three models were trained on the same SMOTE-balanced training
        split and scored on an untouched, real-distribution 20% test set.{" "}
        <span className="text-ink">{best.Model}</span> comes out ahead on every
        metric below.
      </p>

      {/* Metrics table */}
      <div className="overflow-x-auto mb-12 border border-line">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-line text-muted text-left">
              <th className="px-4 py-3 font-normal">Model</th>
              <th className="px-4 py-3 font-normal">Accuracy</th>
              <th className="px-4 py-3 font-normal">Precision (macro)</th>
              <th className="px-4 py-3 font-normal">Recall (macro)</th>
              <th className="px-4 py-3 font-normal">F1 (macro)</th>
              <th className="px-4 py-3 font-normal">ROC-AUC</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.Model} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-ink">{r.Model}</td>
                <td className="px-4 py-3">{pct(r.Accuracy)}</td>
                <td className="px-4 py-3">{pct(r["Precision (macro)"])}</td>
                <td className="px-4 py-3">{pct(r["Recall (macro)"])}</td>
                <td className="px-4 py-3">{pct(r["F1-score (macro)"])}</td>
                <td className="px-4 py-3">{pct(aucScores[r.Model] ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar chart */}
      <section className="mb-16">
        <h2 className="font-display text-2xl mb-6">Metric breakdown</h2>
        <div className="border border-line bg-panel p-4">
          <MetricsBarChart results={results} />
        </div>
      </section>

      {/* Confusion matrices */}
      <section className="mb-16">
        <h2 className="font-display text-2xl mb-6">Confusion matrix — {best.Model}</h2>
        <p className="text-muted mb-6 max-w-2xl">
          Diagonal cells (teal) are correct classifications; off-diagonal
          cells (coral) are misclassifications, on the binary BENIGN vs
          ATTACK task.
        </p>
        <ConfusionMatrix matrix={confusionData[best.Model]} labels={confusionData.labels} />
      </section>

      {/* Feature importance */}
      <section>
        <h2 className="font-display text-2xl mb-2">What the model looks at</h2>
        <p className="text-muted mb-6 max-w-2xl">
          Top contributing features from the Random Forest, ranked by Gini
          importance.
        </p>
        <div className="border border-line bg-panel p-4">
          <FeatureImportanceChart data={featureImportance} />
        </div>
      </section>
    </div>
  );
}
