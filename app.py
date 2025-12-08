import os
from typing import List, Tuple

import joblib
import numpy as np
from flask import Flask, render_template_string, request
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

from config import MODEL_DIR
from preprocess import load_housing_data, preprocess_ames

FEATURES: List[str] = [
    "Gr_Liv_Area",
    "Overall_Qual",
    "Garage_Cars",
    "Total_Bsmt_SF",
    "1st_Flr_SF",
]
MODEL_PATH = os.path.join(MODEL_DIR, "web_random_forest.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "web_scaler.pkl")


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
      {% for key, label in fields.items() %}
        <label for=\"{{ key }}\">{{ label }}</label>
        <input type=\"number\" step=\"0.01\" name=\"{{ key }}\" id=\"{{ key }}\" required value=\"{{ request.form.get(key, '') }}\" />
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
        fields={
            "Gr_Liv_Area": "Diện tích ở (Gr Liv Area, sqft)",
            "Overall_Qual": "Chất lượng tổng thể (Overall Qual)",
            "Garage_Cars": "Số chỗ để xe (Garage Cars)",
            "Total_Bsmt_SF": "Diện tích tầng hầm (Total Bsmt SF)",
            "1st_Flr_SF": "Diện tích tầng 1 (1st Flr SF)",
        },
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
        fields={
            "Gr_Liv_Area": "Diện tích ở (Gr Liv Area, sqft)",
            "Overall_Qual": "Chất lượng tổng thể (Overall Qual)",
            "Garage_Cars": "Số chỗ để xe (Garage Cars)",
            "Total_Bsmt_SF": "Diện tích tầng hầm (Total Bsmt SF)",
            "1st_Flr_SF": "Diện tích tầng 1 (1st Flr SF)",
        },
        prediction=y_pred,
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
