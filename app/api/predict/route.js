import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// This route must run on the Node.js runtime (not Edge) — onnxruntime-web's
// package.json automatically resolves to its Node-optimized build
// (dist/ort.node.min.js) when required from a Node.js environment.
export const runtime = "nodejs";

const MODEL_DIR = path.join(process.cwd(), "model");
const ONNX_PATH = path.join(MODEL_DIR, "rf_model.onnx");

let cachedSession = null;
let cachedMeta = null;

function loadMeta() {
  if (cachedMeta) return cachedMeta;
  const read = (file) => JSON.parse(fs.readFileSync(path.join(MODEL_DIR, file), "utf-8"));
  cachedMeta = {
    scaler: read("scaler.json"),
    featureColumns: read("feature_columns.json"),
    labelMap: read("label_map.json"),
    medians: read("feature_medians.json"),
    topDemoFeatures: read("top_demo_features.json"),
  };
  return cachedMeta;
}

async function getSession() {
  if (cachedSession) return cachedSession;
  // Lazy import so this dependency is only touched when a real model exists —
  // keeps the demo-mode path lightweight and avoids loading the WASM runtime
  // on every cold start if it isn't needed yet.
  const ort = await import("onnxruntime-web");
  cachedSession = await ort.InferenceSession.create(ONNX_PATH);
  cachedSession.__ort = ort;
  return cachedSession;
}

function buildFullVector(userFeatures, featureColumns, medians) {
  return featureColumns.map((col) => {
    const v = userFeatures[col];
    if (v !== undefined && v !== null && v !== "") return Number(v);
    return medians[col] !== undefined ? Number(medians[col]) : 0;
  });
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

// Heuristic fallback used only when rf_model.onnx hasn't been added yet.
// Scores how far the submitted top features deviate from their medians —
// gives a responsive, plausible-feeling demo without pretending to be the
// real trained model.
function heuristicPredict(userFeatures, topDemoFeatures, medians) {
  let score = 0;
  topDemoFeatures.forEach((feat, i) => {
    const median = Number(medians[feat]) || 1;
    const value = Number(userFeatures[feat]);
    if (Number.isNaN(value)) return;
    const deviation = Math.abs(value - median) / Math.abs(median || 1);
    const weight = 1 / (i + 1); // earlier (more "important") features weigh more
    score += deviation * weight;
  });
  const probAttack = sigmoid(score * 1.5 - 1.5);
  const label = probAttack >= 0.5 ? "ATTACK" : "BENIGN";
  const confidence = (label === "ATTACK" ? probAttack : 1 - probAttack) * 100;
  return { label, confidence };
}

export async function GET() {
  const meta = loadMeta();
  const hasRealModel = fs.existsSync(ONNX_PATH);
  return NextResponse.json({
    mode: hasRealModel ? "model" : "heuristic",
    topDemoFeatures: meta.topDemoFeatures,
    medians: meta.medians,
  });
}

export async function POST(request) {
  try {
    const meta = loadMeta();
    const body = await request.json();
    const userFeatures = body.features || {};
    const hasRealModel = fs.existsSync(ONNX_PATH);

    if (!hasRealModel) {
      const { label, confidence } = heuristicPredict(
        userFeatures,
        meta.topDemoFeatures,
        meta.medians
      );
      return NextResponse.json({
        success: true,
        mode: "heuristic",
        prediction: label,
        confidence: Number(confidence.toFixed(2)),
        note:
          "No trained model uploaded yet — this verdict comes from a simple heuristic, not the real Random Forest. See model/README.md.",
      });
    }

    const session = await getSession();
    const ort = session.__ort;
    const { scaler, featureColumns } = meta;

    const rawVector = buildFullVector(userFeatures, featureColumns, meta.medians);
    const scaled = rawVector.map((v, i) => (v - scaler.mean[i]) / scaler.scale[i]);

    const inputTensor = new ort.Tensor("float32", Float32Array.from(scaled), [1, scaled.length]);
    const outputNames = session.outputNames;
    const results = await session.run({ [session.inputNames[0]]: inputTensor });

    const labelOutput = results[outputNames[0]];
    const probaOutput = results[outputNames[1]];

    const predictedIndex = Number(labelOutput.data[0]);
    const predictedLabel = meta.labelMap[String(predictedIndex)] ?? String(predictedIndex);

    let confidence = null;
    if (probaOutput?.data) {
      const probs = Array.from(probaOutput.data);
      confidence = Math.max(...probs) * 100;
    }

    return NextResponse.json({
      success: true,
      mode: "model",
      prediction: predictedLabel,
      confidence: confidence !== null ? Number(confidence.toFixed(2)) : null,
    });
  } catch (err) {
    console.error("predict route error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
