import os

from config import FIG_DIR, MODEL_DIR, RANDOM_STATE, RESULTS_PATH, TEST_SIZE
from model import (
    build_default_models,
    get_best_model,
    save_models,
    save_results_json,
    train_models_parallel,
)
from preprocess import (
    basic_statistics,
    load_housing_data,
    preprocess_ames,
    split_features_target,
    train_test_split_scaled,
)
from visualize import (
    plot_correlation_heatmap,
    plot_feature_vs_target,
    plot_price_distribution,
)


def main():
    print("[STEP] Load Ames Housing...")
    df = load_housing_data("data/AmesHousing.csv")
    df = preprocess_ames(df)

    print("[STEP] Thống kê dữ liệu...")
    print(df.describe())
    stats = basic_statistics(df)
    print(stats["head"])
    print(stats["describe"].head())
    print(stats["missing"].head())

    print("[STEP] Vẽ biểu đồ...")
    plot_price_distribution(df, "PRICE", save_path=os.path.join(FIG_DIR, "price_distribution.png"))

    # Top usable columns
    features = ["Gr_Liv_Area", "Overall_Qual", "Garage_Cars", "Total_Bsmt_SF", "1st_Flr_SF"]

    for ft in features:
        plot_feature_vs_target(df, ft, "PRICE",
                               save_path=os.path.join(FIG_DIR, f"{ft}_vs_PRICE.png"))

    # Heatmap top-20
    print("[STEP] Vẽ heatmap top20...")
    top_cols = df.corr()["PRICE"].abs().sort_values(ascending=False).head(20).index
    plot_correlation_heatmap(df[top_cols], save_path=os.path.join(FIG_DIR, "top20_heatmap.png"))

    print("[STEP] Train/test split...")
    X, y = split_features_target(df)
    X_train, X_test, y_train, y_test, scaler = train_test_split_scaled(
        X, y, TEST_SIZE, RANDOM_STATE
    )

    print("[STEP] Build models...")
    models = build_default_models()

    print("[STEP] Training (parallel)...")
    results = train_models_parallel(models, X_train, y_train, X_test, y_test)

    print("\n=== KẾT QUẢ ===")
    for name, r in results.items():
        print(name, r)

    print("[STEP] BEST MODEL:")
    best_name, best_model = get_best_model(results)
    print(best_name, best_model)

    print("[STEP] Saving...")
    save_models(results, MODEL_DIR)
    save_results_json(results, RESULTS_PATH)

    print("\n[DONE] FULL PIPELINE COMPLETED.")


if __name__ == "__main__":
    main()
