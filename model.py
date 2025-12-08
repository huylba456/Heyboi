from __future__ import annotations
import json
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, asdict
from typing import Any, Dict, Tuple

import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.neighbors import KNeighborsRegressor


@dataclass
class ModelResult:
    name: str
    mae: float
    rmse: float
    r2: float
    model: Any

    def to_dict(self):
        d = asdict(self)
        d.pop("model", None)
        return d


def build_default_models() -> Dict[str, Any]:
    return {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(n_estimators=400, random_state=42),
        "KNN (k=5)": KNeighborsRegressor(n_neighbors=5),
    }


def _train_single_model(
    name: str,
    model: Any,
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_test: np.ndarray,
    y_test: np.ndarray,
) -> ModelResult:
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = mean_squared_error(y_test, y_pred) ** 0.5  # RMSE
    r2 = r2_score(y_test, y_pred)

    return ModelResult(name, mae, rmse, r2, model)


def train_models_parallel(models, X_train, y_train, X_test, y_test, max_workers=4):
    results = {}

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(_train_single_model, n, m, X_train, y_train, X_test, y_test): n
            for n, m in models.items()
        }

        for future in as_completed(futures):
            name = futures[future]
            try:
                results[name] = future.result()
            except Exception as e:
                print(f"[ERROR] Lỗi khi train model {name}: {e}")

    return results


def save_models(results: Dict[str, ModelResult], model_dir: str):
    os.makedirs(model_dir, exist_ok=True)

    for name, res in results.items():
        fname = name.lower().replace(" ", "_").replace("(", "").replace(")", "")
        path = os.path.join(model_dir, f"{fname}.pkl")
        joblib.dump(res.model, path)
        print(f"[SAVE] Model {name} -> {path}")


def save_results_json(results: Dict[str, ModelResult], path: str):
    folder = os.path.dirname(path)

    # Chỉ tạo folder nếu tồn tại tên thư mục
    if folder not in ["", None]:
        os.makedirs(folder, exist_ok=True)

    data = {name: res.to_dict() for name, res in results.items()}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

    print(f"[SAVE] Kết quả -> {path}")

def get_best_model(results: Dict[str, ModelResult]) -> Tuple[str, ModelResult]:
    best = max(results, key=lambda k: results[k].r2)
    return best, results[best]
