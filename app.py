import os
from typing import Dict, List, Tuple

import joblib
import numpy as np
from flask import Flask, render_template_string, request
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

from config import MODEL_DIR
from preprocess import load_housing_data, preprocess_ames


FEATURE_INFO: List[Dict[str, str]] = [
    {
        "name": "MS_SubClass",
        "raw": "MS SubClass",
        "label": "MS SubClass – Building class (Phân loại nhà)",
    },
    {
        "name": "Lot_Area",
        "raw": "Lot Area",
        "label": "Lot Area – Diện tích lô đất (sqft)",
    },
    {
        "name": "Overall_Qual",
        "raw": "Overall Qual",
        "label": "Overall Qual – Chất lượng tổng thể (1-10)",
    },
    {
        "name": "Overall_Cond",
        "raw": "Overall Cond",
        "label": "Overall Cond – Tình trạng tổng thể (1-9)",
    },
    {
        "name": "Year_Built",
        "raw": "Year Built",
        "label": "Year Built – Năm xây dựng",
    },
    {
        "name": "Gr_Liv_Area",
        "raw": "Gr Liv Area",
        "label": "Gr Liv Area – Diện tích sàn sử dụng trên mặt đất (sqft)",
    },
    {
        "name": "Garage_Cars",
        "raw": "Garage Cars",
        "label": "Garage Cars – Số chỗ để xe trong garage",
    },
    {
        "name": "Garage_Area",
        "raw": "Garage Area",
        "label": "Garage Area – Diện tích garage (sqft)",
    },
    {
        "name": "Total_Bsmt_SF",
        "raw": "Total Bsmt SF",
        "label": "Total Bsmt SF – Tổng diện tích tầng hầm (sqft)",
    },
    {
        "name": "Full_Bath",
        "raw": "Full Bath",
        "label": "Full Bath – Số phòng tắm đầy đủ",
    },
]

FEATURES: List[str] = [info["name"] for info in FEATURE_INFO]
MODEL_PATH = os.path.join(MODEL_DIR, "web_random_forest.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "web_scaler.pkl")


def _load_feature_ranges() -> Dict[str, Dict[str, float]]:
    """Load min/max ranges for the selected fields from the raw Ames dataset."""

    df = load_housing_data("data/AmesHousing.csv")

    ranges: Dict[str, Dict[str, float]] = {}
    for info in FEATURE_INFO:
        series = df[info["raw"]].dropna()
        ranges[info["name"]] = {
            "min": float(series.min()),
            "max": float(series.max()),
        }

    return ranges


RANGES = _load_feature_ranges()
FIELDS = {
    info["name"]: {
        "label": f"{info['label']} (Khoảng dữ liệu: {int(RANGES[info['name']]['min'])} – {int(RANGES[info['name']]['max'])})",
        "min": RANGES[info["name"]]["min"],
        "max": RANGES[info["name"]]["max"],
        "step": 1,
    }
    for info in FEATURE_INFO
}


def _train_model() -> Tuple[RandomForestRegressor, StandardScaler]:
    """Train a RandomForest model on key numeric features for demo serving."""
    df = preprocess_ames(load_housing_data("data/AmesHousing.csv"))
    X = df[FEATURES]
    y = df["PRICE"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = RandomForestRegressor(n_estimators=400, random_state=42)
    model.fit(X_scaled, y)

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump({"scaler": scaler, "features": FEATURES}, SCALER_PATH)

    return model, scaler


def load_model() -> Tuple[RandomForestRegressor, StandardScaler]:
    """Load persisted model + scaler, training on demand if missing."""
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        meta = joblib.load(SCALER_PATH)
        return model, meta["scaler"]

    return _train_model()


app = Flask(__name__)
model, scaler = load_model()


TEMPLATE = """
<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\">
  <title>House Price Predictor</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; background: #f4f6f8; }
    .container { max-width: 640px; margin: auto; background: #fff; padding: 24px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    label { display: block; margin-top: 12px; font-weight: bold; }
    input { width: 100%; padding: 10px; margin-top: 6px; border-radius: 6px; border: 1px solid #d0d7de; }
    button { margin-top: 18px; padding: 12px 16px; background: #2563eb; color: #fff; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-size: 15px; }
    button:hover { background: #1d4ed8; }
    .result { margin-top: 18px; padding: 12px; border-radius: 8px; background: #ecfeff; color: #0f172a; border: 1px solid #bae6fd; }
  </style>
</head>
<body>
  <div class=\"container\">
    <h2>Demo dự đoán giá nhà (Random Forest)</h2>
    <form method=\"POST\" action=\"/predict\">
      {% for key, meta in fields.items() %}
        <label for=\"{{ key }}\">{{ meta.label }}</label>
        <input
          type=\"number\"
          name=\"{{ key }}\"
          id=\"{{ key }}\"
          step=\"{{ meta.step }}\"
          min=\"{{ meta.min }}\"
          max=\"{{ meta.max }}\"
          required
          value=\"{{ request.form.get(key, '') }}\"
        />
      {% endfor %}
      <button type=\"submit\">Dự đoán</button>
    </form>
    {% if prediction is not none %}
      <div class=\"result\">Giá dự đoán: <strong>${{ '{:,.0f}'.format(prediction) }}</strong></div>
    {% endif %}
  </div>
</body>
</html>
"""


@app.route("/", methods=["GET"])
def index():
    return render_template_string(
        TEMPLATE,
        fields=FIELDS,
        prediction=None,
    )


@app.route("/predict", methods=["POST"])
def predict():
    values = []
    for feature in FEATURES:
        raw_val = request.form.get(feature)
        try:
            values.append(float(raw_val))
        except (TypeError, ValueError):
            values.append(0.0)

    scaled = scaler.transform(np.array(values).reshape(1, -1))
    y_pred = model.predict(scaled)[0]

    return render_template_string(
        TEMPLATE,
        fields=FIELDS,
        prediction=y_pred,
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
