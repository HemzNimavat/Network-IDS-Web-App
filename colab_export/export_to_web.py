# ============================================================
# EXPORT CELL — paste this into your Colab notebook as a new cell,
# run it AFTER training rf_model (Step 5.4) and computing `importances`
# (Step 6.5) and `results_df` / `rf_pred` / `rf_proba` / `xgb_pred` /
# `xgb_proba` / `mlp_pred` / `mlp_proba` (Step 6.1-6.4).
#
# It produces everything the Next.js web app needs:
#   rf_model.onnx            -> goes in  ids-web-app/model/
#   scaler.json              -> goes in  ids-web-app/model/
#   feature_columns.json     -> goes in  ids-web-app/model/
#   label_map.json           -> goes in  ids-web-app/model/
#   feature_medians.json     -> goes in  ids-web-app/model/
#   top_demo_features.json   -> goes in  ids-web-app/model/
#   results.json             -> goes in  ids-web-app/data/
#   confusion_matrices.json  -> goes in  ids-web-app/data/
#   auc_scores.json          -> goes in  ids-web-app/data/
#   feature_importance.json  -> goes in  ids-web-app/data/
# ============================================================

!pip install -q skl2onnx onnx

import os
import json
import shutil
import numpy as np
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
from sklearn.metrics import confusion_matrix, roc_auc_score

EXPORT_DIR = "/content/web_export"
os.makedirs(EXPORT_DIR, exist_ok=True)

# ------------------------------------------------------------
# 1. Convert the trained Random Forest binary model to ONNX
#    (zipmap=False keeps the probability output as a plain tensor,
#    which is far easier to consume from onnxruntime-node in JS)
# ------------------------------------------------------------
n_features = X_train.shape[1]
initial_type = [("float_input", FloatTensorType([None, n_features]))]
onnx_model = convert_sklearn(
    rf_model,
    initial_types=initial_type,
    target_opset=12,
    options={id(rf_model): {"zipmap": False}},
)
with open(f"{EXPORT_DIR}/rf_model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())
print("✅ Exported rf_model.onnx")

# ------------------------------------------------------------
# 2. Export StandardScaler parameters (replicated in JS at inference time)
# ------------------------------------------------------------
with open(f"{EXPORT_DIR}/scaler.json", "w") as f:
    json.dump({"mean": scaler.mean_.tolist(), "scale": scaler.scale_.tolist()}, f)
print("✅ Exported scaler.json")

# ------------------------------------------------------------
# 3. Export feature column order (must match training order exactly)
# ------------------------------------------------------------
with open(f"{EXPORT_DIR}/feature_columns.json", "w") as f:
    json.dump(list(X.columns), f)
print("✅ Exported feature_columns.json")

# ------------------------------------------------------------
# 4. Export label mapping (numeric class -> BENIGN/ATTACK)
# ------------------------------------------------------------
label_map = {int(i): cls for i, cls in enumerate(le_binary.classes_)}
with open(f"{EXPORT_DIR}/label_map.json", "w") as f:
    json.dump(label_map, f)
print("✅ Exported label_map.json — mapping:", label_map)

# ------------------------------------------------------------
# 5. Export median value of every feature (used to fill in features not
#    shown on the simplified web demo form)
# ------------------------------------------------------------
medians = X.median().to_dict()
with open(f"{EXPORT_DIR}/feature_medians.json", "w") as f:
    json.dump(medians, f)
print("✅ Exported feature_medians.json")

# ------------------------------------------------------------
# 6. Export the top 12 most important features for the interactive demo form
# ------------------------------------------------------------
top_demo_features = importances.sort_values(ascending=False).head(12).index.tolist()
with open(f"{EXPORT_DIR}/top_demo_features.json", "w") as f:
    json.dump(top_demo_features, f)
print("✅ Exported top_demo_features.json:", top_demo_features)

# ------------------------------------------------------------
# 7. Export model comparison results (for the /results page)
# ------------------------------------------------------------
results_export = results_df.reset_index().to_dict(orient="records")
with open(f"{EXPORT_DIR}/results.json", "w") as f:
    json.dump(results_export, f, indent=2)
print("✅ Exported results.json")

# ------------------------------------------------------------
# 8. Export confusion matrices for all three models
# ------------------------------------------------------------
cm_export = {
    "labels": list(target_names),
    "Random Forest": confusion_matrix(y_test, rf_pred).tolist(),
    "XGBoost": confusion_matrix(y_test, xgb_pred).tolist(),
    "MLP": confusion_matrix(y_test, mlp_pred).tolist(),
}
with open(f"{EXPORT_DIR}/confusion_matrices.json", "w") as f:
    json.dump(cm_export, f, indent=2)
print("✅ Exported confusion_matrices.json")

# ------------------------------------------------------------
# 9. Export ROC-AUC scores for all three models
# ------------------------------------------------------------
auc_export = {
    "Random Forest": roc_auc_score(y_test, rf_proba),
    "XGBoost": roc_auc_score(y_test, xgb_proba),
    "MLP": roc_auc_score(y_test, mlp_proba),
}
with open(f"{EXPORT_DIR}/auc_scores.json", "w") as f:
    json.dump(auc_export, f, indent=2)
print("✅ Exported auc_scores.json")

# ------------------------------------------------------------
# 10. Export top 15 feature importances (for the /results page chart)
# ------------------------------------------------------------
top15 = importances.sort_values(ascending=False).head(15)
feat_imp_export = [{"feature": k, "importance": float(v)} for k, v in top15.items()]
with open(f"{EXPORT_DIR}/feature_importance.json", "w") as f:
    json.dump(feat_imp_export, f, indent=2)
print("✅ Exported feature_importance.json")

# ------------------------------------------------------------
# Zip everything for a single download
# ------------------------------------------------------------
shutil.make_archive("/content/web_export", "zip", EXPORT_DIR)
print("\n📦 All files zipped to /content/web_export.zip")
print("   Extract it and distribute the files into ids-web-app/model/ and")
print("   ids-web-app/data/ as noted in the header comment above.")

try:
    from google.colab import files
    files.download("/content/web_export.zip")
except Exception:
    pass
