const SAMPLE_FLOWS = [
  { src: "10.0.0.14:51322", dst: "192.168.1.5:443", proto: "TCP", verdict: "BENIGN" },
  { src: "10.0.0.9:2210", dst: "192.168.1.5:80", proto: "TCP", verdict: "BENIGN" },
  { src: "172.16.0.3:80", dst: "192.168.1.5:51221", proto: "TCP", verdict: "ATTACK" },
  { src: "10.0.0.22:60110", dst: "192.168.1.5:22", proto: "TCP", verdict: "ATTACK" },
  { src: "10.0.0.14:51330", dst: "192.168.1.5:443", proto: "TCP", verdict: "BENIGN" },
  { src: "10.0.0.31:80", dst: "192.168.1.5:80", proto: "UDP", verdict: "BENIGN" },
  { src: "172.16.0.3:80", dst: "192.168.1.5:51222", proto: "TCP", verdict: "ATTACK" },
  { src: "10.0.0.9:2214", dst: "192.168.1.5:80", proto: "TCP", verdict: "BENIGN" },
];

function Row({ flow, idx }) {
  const isAttack = flow.verdict === "ATTACK";
  return (
    <div
      key={idx}
      className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-line/60 text-xs"
    >
      <span className="text-muted">{flow.src}</span>
      <span className="text-muted">→</span>
      <span className="text-ink/80">{flow.dst}</span>
      <span className="text-muted w-10">{flow.proto}</span>
      <span
        className={
          "w-16 text-right font-medium " + (isAttack ? "text-alert" : "text-safe")
        }
      >
        {flow.verdict}
      </span>
    </div>
  );
}

export default function FlowLogPanel() {
  const doubled = [...SAMPLE_FLOWS, ...SAMPLE_FLOWS];
  return (
    <div className="relative border border-line bg-panel overflow-hidden h-[340px]">
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-2.5 bg-panel border-b border-line z-10">
        <span className="font-mono text-xs text-muted">live_flow_classifier.log</span>
        <span className="flex items-center gap-1.5 font-mono text-xs text-safe">
          <span className="w-1.5 h-1.5 rounded-full bg-safe" />
          streaming
        </span>
      </div>
      <div className="pt-10 font-mono">
        <div className="ticker-scroll">
          {doubled.map((f, i) => (
            <Row flow={f} idx={i} key={i} />
          ))}
        </div>
      </div>
      {/* radar-style scan sweep — the one deliberate motion accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-signal/10 to-transparent scan-sweep" />
    </div>
  );
}
