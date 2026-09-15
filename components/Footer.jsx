export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-muted font-mono">
        <p>Trained on CIC-IDS2017 · Canadian Institute for Cybersecurity, UNB</p>
        <p>Built for academic demonstration — not a production security tool</p>
      </div>
    </footer>
  );
}
