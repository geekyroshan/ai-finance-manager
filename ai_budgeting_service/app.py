from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
import numpy as np
import pandas as pd
import os
from bson import ObjectId, Int64
from prophet import Prophet  # Importing Prophet for forecasting

# ✅ Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Requests

# ✅ MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "PUT_YOUR_MONGODB URI_HERE")

try:
    mongo_client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
    db = mongo_client["test"]  # ✅ Ensure correct database name
    print("✅ MongoDB Connected Successfully")
except Exception as e:
    print(f"❌ MongoDB Connection Error: {e}")
    db = None


# ✅ Helper Function: Convert ObjectId & int64 for JSON serialization
def convert_json_compatible(obj):
    if isinstance(obj, dict):
        return {k: convert_json_compatible(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_json_compatible(i) for i in obj]
    elif isinstance(obj, ObjectId):  # Convert ObjectId to string
        return str(obj)
    elif isinstance(obj, Int64) or isinstance(obj, np.int64):  # Convert MongoDB int64 to Python int
        return int(obj)
    return obj


# ✅ Debugging: Fetch Transactions for a User (FIXED)
@app.route("/api/debug/transactions/<user_id>", methods=["GET"])
def debug_transactions(user_id):
    if db is None:
        return jsonify({"error": "MongoDB not connected"})

    try:
        if not ObjectId.is_valid(user_id):
            return jsonify({"error": "Invalid user_id format"})

        object_id = ObjectId(user_id)
        transactions = list(db["transactions"].find({"user_id": object_id}))

        return jsonify({"transactions": convert_json_compatible(transactions)})

    except Exception as e:
        return jsonify({"error": str(e)})


# ✅ AI-Powered Budgeting Algorithm with **Anomaly Detection**
def analyze_budget(user_id):
    try:
        if not ObjectId.is_valid(user_id):
            return {"error": "Invalid user_id format"}

        object_id = ObjectId(user_id)
        transactions = list(db["transactions"].find({"user_id": object_id}))

        if not transactions:
            return {"error": "No transactions found for this user"}

        # ✅ Convert transactions to DataFrame
        df = pd.DataFrame(transactions)

        if df.empty or "amount" not in df.columns or "type" not in df.columns or "category" not in df.columns:
            return {"error": "Invalid transaction data"}

        df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
        df.dropna(subset=["amount"], inplace=True)
        df["type"] = df["type"].astype(str).str.lower()
        df["category"] = df["category"].astype(str)

        total_income = int(df[df["type"] == "income"]["amount"].sum())
        category_expenses = df[df["type"] == "expense"].groupby("category")["amount"].sum().to_dict()
        total_expense = int(sum(category_expenses.values()))

        if total_income == 0 or total_expense == 0:
            return {
                "error": "Not enough income or expense data to generate insights",
                "total_income": total_income,
                "total_expense": total_expense,
            }

        # ✅ AI-Powered Suggested Budget
        suggested_budget = {
            category: round((amount / total_expense) * total_income, 2)
            for category, amount in category_expenses.items()
        }

        # ✅ Anomaly Detection (Spending Spikes)
        anomalies = {}
        category_stats = df[df["type"] == "expense"].groupby("category")["amount"].agg(["mean", "std"])

        for category, stats in category_stats.iterrows():
            mean = stats["mean"]
            std_dev = stats["std"]

            if category in category_expenses:
                last_expense = category_expenses[category]
                threshold = mean + (2 * std_dev)  # **Set threshold at Mean + 2×SD**

                if last_expense > threshold:
                    anomalies[category] = f"⚠️ You spent ${last_expense}, which is unusually high!"

        result = {
            "message": "Budget insights generated successfully",
            "total_income": total_income,
            "total_expense": total_expense,
            "suggested_budget": suggested_budget,
            "category_expenses": category_expenses,
            "anomalies": anomalies,
        }

        return convert_json_compatible(result)  # ✅ Ensure all int64 values are converted to int

    except Exception as e:
        return {"error": str(e)}


# ✅ Budget Forecasting Function
def forecast_budget(user_id, periods=30):
    try:
        if not ObjectId.is_valid(user_id):
            return {"error": "Invalid user_id format"}

        object_id = ObjectId(user_id)
        transactions = list(db["transactions"].find({"user_id": object_id}))

        if not transactions:
            return {"error": "No transactions found for this user"}

        df = pd.DataFrame(transactions)

        if df.empty or "amount" not in df.columns or "type" not in df.columns or "date" not in df.columns:
            return {"error": "Invalid transaction data"}

        df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
        df.dropna(subset=["amount"], inplace=True)
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df.dropna(subset=["date"], inplace=True)
        df = df[df["type"].str.lower() == "expense"]

        # Prepare data for Prophet
        df_prophet = df.groupby("date")["amount"].sum().reset_index()
        df_prophet.rename(columns={"date": "ds", "amount": "y"}, inplace=True)

        # Train Prophet Model
        model = Prophet()
        model.fit(df_prophet)

        # Forecast Future Expenses
        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)

        # Convert forecast to JSON-compatible format
        forecast_result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(periods)
        return convert_json_compatible(forecast_result.to_dict(orient="records"))

    except Exception as e:
        return {"error": str(e)}


# ✅ API Test Route
@app.route("/")
def home():
    return {"message": "AI Budgeting Service is Running!"}


# ✅ API Endpoint for AI Insights (With Anomaly Detection)
@app.route("/api/budget-insights/<user_id>", methods=["GET"])
def budget_insights(user_id):
    insights = analyze_budget(user_id)
    return jsonify(insights)


# ✅ API Endpoint for Budget Forecasting
@app.route("/api/budget-forecast/<user_id>", methods=["GET"])
def budget_forecast(user_id):
    periods = int(request.args.get("periods", 30))  # Default to 30 days
    forecast = forecast_budget(user_id, periods)
    return jsonify(forecast)


# ✅ Run Flask Server
if __name__ == "__main__":
    app.run(debug=True, port=5001)
