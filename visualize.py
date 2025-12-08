import os
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


def _prepare():
    plt.style.use("ggplot")


def plot_price_distribution(df, target_col, save_path=None):
    _prepare()
    plt.figure(figsize=(8, 5))
    plt.hist(df[target_col], bins=40)
    plt.title("Phân phối giá nhà")
    plt.xlabel("Giá")
    plt.ylabel("Số lượng")
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path)
    plt.show()


def plot_feature_vs_target(df, feature, target_col, save_path=None):
    if feature not in df.columns:
        print(f"[WARN] Không tìm thấy cột {feature}")
        return

    _prepare()
    plt.figure(figsize=(8, 5))
    plt.scatter(df[feature], df[target_col], alpha=0.5)
    plt.title(f"{feature} vs {target_col}")
    plt.xlabel(feature)
    plt.ylabel(target_col)
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path)
    plt.show()


def plot_correlation_heatmap(df, save_path=None):
    corr = df.corr()

    _prepare()
    plt.figure(figsize=(12, 10))
    plt.imshow(corr, cmap="coolwarm", interpolation="nearest")
    plt.colorbar()
    plt.xticks(range(len(corr.columns)), corr.columns, rotation=90)
    plt.yticks(range(len(corr.columns)), corr.columns)
    plt.title("Heatmap tương quan")
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path, bbox_inches="tight")
    plt.show()
