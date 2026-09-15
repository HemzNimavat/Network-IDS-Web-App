# model/

This folder holds everything the `/api/predict` route needs at runtime.
**The files here are placeholders** so the site builds and runs immediately
(in heuristic "demo mode" — see below). For real predictions from your
actual trained Random Forest, replace them with the files produced by the
Colab export cell in `colab_export/export_to_web.py`.

| File | Purpose |
|---|---|
| `rf_model.onnx` | **Not included by default.** Your trained Random Forest, exported to ONNX. Once this file is present, the API route uses it for real inference instead of the heuristic fallback. |
| `feature_columns.json` | Full list of feature names, in the exact order the model was trained on (~70 columns after cleaning). Placeholder currently only lists the 12 demo-form features. |
| `scaler.json` | `mean` and `scale` arrays from the training `StandardScaler`, one entry per feature in `feature_columns.json` order — used to replicate `.transform()` in JavaScript. |
| `label_map.json` | Maps the model's numeric output (0/1) back to `"ATTACK"` / `"BENIGN"`. Order depends on `LabelEncoder`'s alphabetical sort — always regenerate this from your own run rather than assuming it matches the placeholder. |
| `feature_medians.json` | Median value of every feature from the training data. Any feature not exposed in the simplified web form is filled in with its median so the model still receives a complete, realistic input vector. |
| `top_demo_features.json` | The ~12 most important features (by Random Forest importance) exposed as editable inputs on `/demo`, so visitors aren't asked to fill in all ~70 raw flow statistics. |

## Demo mode vs. real mode
The API route (`app/api/predict/route.js`) checks whether `rf_model.onnx`
exists:
- **Missing (default):** falls back to a simple heuristic that compares the
  submitted values against their medians — enough to make the demo feel
  responsive out of the box, clearly labeled "heuristic demo mode" in the UI.
- **Present:** loads the real ONNX model and scaler and runs true inference.

Run the export cell, download the resulting files, and drop them all into
this folder (overwriting the placeholders) before your final deployment.
