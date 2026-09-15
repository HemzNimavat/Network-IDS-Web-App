# IDS// — AI-Based Intrusion Detection System (Web App)

A Next.js front end for the CIC-IDS2017 Random Forest intrusion detector:
an overview page, a results/metrics page, and a live flow-classification
demo backed by a Node.js API route.

**It deploys to Vercel immediately, even before you've exported a trained
model** — the `/api/predict` route falls back to a transparent heuristic
demo mode until you add your real `rf_model.onnx`. See [Demo mode vs. real
mode](#demo-mode-vs-real-mode) below.

## Stack
- **Next.js 14** (App Router)
- **Tailwind CSS** for styling
- **Recharts** for the metrics/feature-importance charts
- **onnxruntime-node** for server-side model inference
- **lucide-react** for icons

## Project structure
```
ids-web-app/
├── app/
│   ├── page.jsx                 # Landing page
│   ├── results/page.jsx         # Model comparison, charts, confusion matrix
│   ├── demo/page.jsx            # Live prediction demo
│   └── api/predict/route.js     # Node.js inference API route
├── components/                  # UI components (charts, forms, nav, etc.)
├── data/                        # results.json, confusion_matrices.json, etc.
│                                 # — placeholders; replace with your notebook's real output
├── model/                       # rf_model.onnx + preprocessing metadata
│                                 # — placeholders; replace with your notebook's real export
├── colab_export/
│   └── export_to_web.py         # Paste into your Colab notebook to generate real assets
├── package.json
├── next.config.mjs
├── tailwind.config.js
└── vercel.json
```

## 1. Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`. With the placeholder files in `model/` and
`data/`, everything works out of the box — the results page shows example
metrics and the live demo runs in heuristic mode.

## 2. Plug in your real trained model
1. Open your Colab notebook (the one that trains `rf_model`, computes
   `results_df`, `importances`, `rf_pred`/`rf_proba`, etc.).
2. Paste the contents of `colab_export/export_to_web.py` into a new cell at
   the end of the notebook and run it. It downloads `web_export.zip`.
3. Extract that zip. Copy:
   - `rf_model.onnx`, `scaler.json`, `feature_columns.json`, `label_map.json`,
     `feature_medians.json`, `top_demo_features.json` → into this project's
     `model/` folder (overwrite the placeholders).
   - `results.json`, `confusion_matrices.json`, `auc_scores.json`,
     `feature_importance.json` → into this project's `data/` folder
     (overwrite the placeholders).
4. Run `npm run dev` again and confirm:
   - `/results` shows your real metrics.
   - `/demo` no longer shows the "heuristic demo mode" badge, and returns
     real model predictions.

### Demo mode vs. real mode
The API route checks whether `model/rf_model.onnx` exists:
- **Missing:** it scores the submitted values against their medians with a
  simple heuristic and clearly labels the result "heuristic demo mode" —
  this is what ships by default so the site is deployable immediately.
- **Present:** it loads the real ONNX model and scaler and returns true
  Random Forest predictions.

## 3. Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
vercel login
vercel            # first deploy — follow the prompts
vercel --prod     # promote to production
```

### Option B — GitHub + Vercel dashboard
```bash
git init
git add .
git commit -m "Initial commit: AI IDS web app"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
Then on [vercel.com](https://vercel.com): **Add New Project** → import the
repository → Vercel auto-detects Next.js → **Deploy**. No environment
variables are required for this project.

## Troubleshooting

**Build fails mentioning `onnxruntime-node` / native bindings**
`next.config.mjs` already marks `onnxruntime-node` as an external server
package so webpack doesn't try to bundle its native `.node` binary. If you
still see bundling errors, confirm you're on Next.js 14.x (the config key
`experimental.serverComponentsExternalPackages` changed name in Next 15 to
`serverExternalPackages`).

**Function size / deployment size warnings**
`onnxruntime-node` plus a 200-tree Random Forest ONNX file can add up. If
you hit Vercel's function size limit on the Hobby plan:
- Re-train a smaller model specifically for the web demo (e.g.
  `n_estimators=100, max_depth=15` instead of 200/25) — keep the full model
  in your notebook for the official reported metrics, and export the
  smaller one just for deployment.
- Alternatively, swap `onnxruntime-node` for `onnxruntime-web` (WASM
  backend), which has a smaller footprint but is slightly slower per
  request.

**Predictions look off after adding the real model**
Double check that `feature_columns.json` lists every feature in the *exact*
order your notebook trained on (`list(X.columns)`), and that
`feature_medians.json`/`scaler.json` were exported from the same run — a
mismatched order will silently produce wrong predictions.

**Rare classes / label order**
`label_map.json`'s keys come from `LabelEncoder`, which sorts alphabetically
— always regenerate it from your own run rather than assuming
`0 = ATTACK, 1 = BENIGN` matches a different dataset or run.

## Notes
- This is an academic demonstration, not a production security tool — the
  underlying dataset (CIC-IDS2017) is from 2017 and the demo simplifies ~70
  raw flow features down to 12 editable inputs (the rest default to their
  training median).
- See the main project's `docs/project_report_notes.md` (in the notebook
  project folder) for report-writing guidance.
