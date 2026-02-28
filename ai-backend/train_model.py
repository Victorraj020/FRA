import os
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# Paths
BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, 'data', 'village_indicators_light.geojson')
MODEL_DIR = os.path.join(BASE_DIR, 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'priority_model.pkl')

print(f"Loading dataset from {DATA_PATH}...")
try:
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)
    features = geojson_data.get('features', [])
except FileNotFoundError:
    print("Error: Dataset not found. Ensure 'village_indicators_light.geojson' is in the 'data' folder.")
    exit(1)

# Extract features and targets into a Pandas DataFrame
print(f"Extracting features from {len(features)} records...")
data_list = []
for f in features:
    props = f.get('properties', {})
    
    # We want to predict Priority Score
    target = float(props.get('priority_score', 0))
    
    # Based on these independent features
    water_stress = float(props.get('water_stress_score', 0))
    fra_count = float(props.get('fra_beneficiary_count', 0))
    pm_count = float(props.get('pm_kisan_count', 0))
    
    # Safely parse JJM % (it was a string ending in % in some earlier data)
    jjm_raw = str(props.get('jjm_coverage_pct', '0'))
    try:
        jjm_val = float(jjm_raw.replace('%', ''))
    except ValueError:
        jjm_val = 0.0

    data_list.append({
        'water_stress': water_stress,
        'jjm_coverage': jjm_val,
        'pm_kisan': pm_count,
        'fra_count': fra_count,
        'target_score': target
    })

df = pd.DataFrame(data_list)

# Define X (features) and Y (target)
X = df[['water_stress', 'jjm_coverage', 'pm_kisan', 'fra_count']]
y = df['target_score']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training Random Forest Regressor...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate model
predictions = model.predict(X_test)
mse = mean_squared_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("--- Training Complete ---")
print(f"Mean Squared Error: {mse:.2f}")
print(f"R2 Score: {r2:.2f}")

# Save the trained model
os.makedirs(MODEL_DIR, exist_ok=True)
joblib.dump(model, MODEL_PATH)
print(f"✅ Model successfully saved to {MODEL_PATH}")
