from typing import Dict, Tuple
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


def load_housing_data(path: str = "data/AmesHousing.csv") -> pd.DataFrame:
    df = pd.read_csv(path)

    # rename target
    df.rename(columns={"SalePrice": "PRICE"}, inplace=True)

    return df


def basic_statistics(df: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    return {
        "head": df.head(),
        "describe": df.describe(include="all"),
        "missing": df.isnull().sum().sort_values(ascending=False),
    }


def preprocess_ames(df: pd.DataFrame) -> pd.DataFrame:
    """
    - rename cột (bỏ khoảng trắng)
    - drop ID
    - fill missing
    - encode
    """
    # Rename columns: space -> underscore
    df.rename(columns=lambda c: c.strip().replace(" ", "_"), inplace=True)

    # Remove non-use columns
    for col in ["Order", "PID"]:
        if col in df.columns:
            df.drop(columns=[col], inplace=True)

    # Fill missing values
    for col in df.columns:
        if df[col].dtype == object:
            df[col].fillna("Missing", inplace=True)
        else:
            df[col].fillna(df[col].median(), inplace=True)

    # One-hot encoding
    df = pd.get_dummies(df, drop_first=True)

    return df


def split_features_target(df: pd.DataFrame, target_col: str = "PRICE"):
    X = df.drop(columns=[target_col])
    y = df[target_col]
    return X, y


def train_test_split_scaled(
    X: pd.DataFrame,
    y: pd.Series,
    test_size: float,
    random_state: int,
):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return X_train_scaled, X_test_scaled, y_train.values, y_test.values, scaler
