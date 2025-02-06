from prophet import Prophet
import pandas as pd

# 🔹 Function to Prepare Data for Forecasting
def prepare_data(transactions):
    """
    Prepare user transaction data for forecasting.
    """
    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df.dropna(subset=["amount"], inplace=True)
    df = df[df["type"].str.lower() == "expense"]  # Filter only expenses
    
    # Group by date and sum expenses
    df_grouped = df.groupby("date")["amount"].sum().reset_index()
    df_grouped.rename(columns={"date": "ds", "amount": "y"}, inplace=True)
    
    return df_grouped


# 🔹 Function to Train Forecasting Model
def train_forecasting_model(df_grouped):
    """
    Train Prophet model on expense data.
    """
    model = Prophet()
    model.fit(df_grouped)
    return model


# 🔹 Function to Make Future Predictions
def forecast_expenses(model, periods=30):
    """
    Forecast future expenses for the next "periods" days.
    """
    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)
    return forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]]


# 🔹 Main Forecasting Function
def generate_expense_forecast(transactions):
    """
    Full pipeline: Prepare data, train model, and forecast expenses.
    """
    df_grouped = prepare_data(transactions)
    model = train_forecasting_model(df_grouped)
    forecast = forecast_expenses(model)
    
    return forecast.to_dict(orient="records")
