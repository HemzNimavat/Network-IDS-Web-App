import PredictionForm from "@/components/PredictionForm";

export const metadata = {
  title: "Live demo — IDS//",
};

export default function DemoPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="font-mono text-sm text-signal mb-4">interactive · flow classifier</p>
      <h1 className="font-display text-4xl mb-4">Classify a flow</h1>
      <p className="text-muted max-w-2xl mb-10 leading-relaxed">
        Adjust the flow's most influential characteristics below. Every other
        feature the model expects is filled in with its typical (median)
        value from training, so the model still sees a complete, realistic
        flow.
      </p>
      <PredictionForm />
    </div>
  );
}
