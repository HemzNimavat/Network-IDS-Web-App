import Link from "next/link";
import FlowLogPanel from "@/components/FlowLogPanel";
import StatStrip from "@/components/StatStrip";
import PipelineSteps from "@/components/PipelineSteps";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-14 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-sm text-signal mb-4">CIC-IDS2017 · machine learning</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] mb-6">
            Tell benign traffic from an attack, flow by flow.
          </h1>
          <p className="text-muted text-lg leading-relaxed mb-8 max-w-md">
            A network intrusion detection system trained on 2.8 million labeled
            flows. Three models — Random Forest, XGBoost, and a neural
            network — are trained side by side and evaluated on the same
            untouched test set.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/demo"
              className="bg-signal text-bg font-medium px-5 py-3 rounded hover:bg-signal/90 transition-colors"
            >
              Run the live demo
            </Link>
            <Link
              href="/results"
              className="border border-line px-5 py-3 rounded hover:border-signal hover:text-signal transition-colors"
            >
              View model results
            </Link>
          </div>
        </div>
        <FlowLogPanel />
      </section>

      <StatStrip />

      {/* Problem statement */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-2xl mb-4">Why flow-based detection</h2>
          <p className="text-muted leading-relaxed">
            Signature-based systems catch known attacks but miss new variants.
            CIC-IDS2017 instead describes each connection as a flow — duration,
            packet size statistics, byte rates, flag counts — so a model can
            learn the shape of an attack rather than memorizing a specific
            signature.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl mb-4">What's in the dataset</h2>
          <p className="text-muted leading-relaxed">
            Eight days of real, benign background traffic mixed with staged
            attacks — DoS, DDoS, port scans, brute force, web attacks, botnet
            activity, and infiltration — captured by the Canadian Institute
            for Cybersecurity and summarized into 78 numeric features per
            flow.
          </p>
        </div>
      </section>

      {/* Pipeline */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="font-display text-2xl mb-8">How a flow gets classified</h2>
        <PipelineSteps />
      </section>

      {/* CTA band */}
      <section className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl mb-2">See it classify a flow</h2>
            <p className="text-muted">
              Adjust the flow's key characteristics and get a live verdict.
            </p>
          </div>
          <Link
            href="/demo"
            className="bg-signal text-bg font-medium px-5 py-3 rounded hover:bg-signal/90 transition-colors whitespace-nowrap"
          >
            Open the live demo
          </Link>
        </div>
      </section>
    </div>
  );
}
