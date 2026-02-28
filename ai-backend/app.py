import os
import json
import requests
import re
import joblib
from flask import Flask, jsonify, request
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS so the React frontend can talk to this API
CORS(app)

# --- Configuration ---
# Load the local data source
data_path = os.path.join(os.path.dirname(__file__), 'data', 'village_indicators_light.geojson')

# Load dataset once into memory on startup
try:
    with open(data_path, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)
    features = geojson_data.get('features', [])
    print(f"Loaded {len(features)} village records for Analytics.")
except Exception as e:
    print(f"Warning: Could not load data file. {e}")
    features = []

# Load the custom ML predictive model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'priority_model.pkl')
try:
    priority_model = joblib.load(MODEL_PATH)
    print("✅ Loaded Custom ML Predictive Model (priority_model.pkl)")
except Exception as e:
    print(f"Warning: Could not load ML model. Predictive chat features disabled. {e}")
    priority_model = None


# --- Analytics Engine ---
def extract_metrics(features):
    """Calculates state-wide averages and priority counts purely using python statistics."""
    if not features:
        return {
            "total_villages": 0,
            "high_priority_count": 0,
            "water_stress_average": 0
        }
        
    total_stress = 0
    stress_count = 0
    high_priority_count = 0
    
    for f in features:
        props = f.get('properties', {})
        
        # Priority
        score = float(props.get('priority_score', 0))
        if score >= 60: # Lowered threshold to 60 based on data scale
            high_priority_count += 1
            
        # Water Stress (dataset has this as a 0.0 to 1.0 scale)
        stress = props.get('water_stress_score')
        if stress is not None:
            total_stress += float(stress)
            stress_count += 1
            
    # Convert the 0.0-1.0 stress score to a 0-100 percentage for the dashboard
    avg_stress = (total_stress / stress_count * 100) if stress_count > 0 else 0
    
    return {
        "total_villages": len(features),
        "high_priority_count": high_priority_count,
        "water_stress_average": round(avg_stress, 1)  # Now properly scaled to 0-100 percentage
    }


def generate_alerts(features):
    """Scans the dataset to find the most critical problems and generates alert objects."""
    alerts = []
    
    if not features:
        return alerts
        
    # Example heuristic 1: Find districts with consistently awful JJM coverage
    district_jjm = {}
    for f in features:
        props = f.get('properties', {})
        dist = props.get('district', 'Unknown')
        
        # Safely parse jjm_coverage_pct which might have a '%' sign from some previous mocks
        jjm_str = str(props.get('jjm_coverage_pct', ''))
        
        if jjm_str and jjm_str != 'None':
            try:
                jjm_val = float(jjm_str.replace('%', ''))
                if dist not in district_jjm:
                    district_jjm[dist] = []
                district_jjm[dist].append(jjm_val)
            except ValueError:
                pass
            
    # Calculate district averages
    worst_district = None
    worst_jjm_avg = 100.0
    
    for dist, scores in district_jjm.items():
        if len(scores) > 10:  # Need adequate sample size
            avg = sum(scores) / len(scores)
            if avg < worst_jjm_avg:
                worst_jjm_avg = avg
                worst_district = dist
                
    if worst_district and worst_jjm_avg < 40:
        alerts.append({
            "title": f"Critical JJM Shortfall in {worst_district}",
            "level": "high",
            "description": f"The average Jal Jeevan Mission coverage in {worst_district} has dropped to {round(worst_jjm_avg,1)}%, significantly below the state requirement."
        })
        
    # Example heuristic 2: Check for massive PM-Kisan disparities
    pm_kisan_zeros = sum(1 for f in features if float(f.get('properties', {}).get('pm_kisan_count', 1)) == 0)
    if pm_kisan_zeros > 500:
        alerts.append({
            "title": "PM-Kisan Enrollment Gap",
            "level": "medium",
            "description": f"Detected {pm_kisan_zeros} villages reporting absolutely zero PM-Kisan beneficiaries. Verification drive recommended."
        })
        
    if not alerts:
        alerts.append({
            "title": "Nominal Operations",
            "level": "low",
            "description": "No critical regional disparities found in the current dataset slice."
        })
        
    return alerts


def generate_recommendations(alerts):
    """Maps specific types of alerts into actionable recommendations."""
    recs = []
    
    for alert in alerts:
        if "JJM" in alert['title']:
            recs.append(f"Deploy emergency water infrastructure funds to the worst performing districts like {alert['title'].split('in ')[-1]}.")
        elif "PM-Kisan" in alert['title']:
            recs.append("Initiate a state-wide awareness camp targeting villages with 0% PM-Kisan enrollment.")
            
    # Add a generic data-driven recommendation
    recs.append("Cross-reference high-priority FRA villages with upcoming infrastructure budgets to maximize tribal welfare impact.")
    
    return recs


@app.route('/api/insights', methods=['GET'])
def get_insights():
    """
    Returns AI-like insights generated dynamically from local data.
    """
    
    metrics = extract_metrics(features)
    alerts = generate_alerts(features)
    recommendations = generate_recommendations(alerts)
    
    # Construct an intelligent summary based on the metrics
    summary = "System status is stable."
    if metrics['high_priority_count'] > (metrics['total_villages'] * 0.1):
         summary = f"Attention Required: Over 10% of the mapped region ({metrics['high_priority_count']} villages) is currently flagged as High Priority needing immediate intervention, driven primarily by infrastructure gaps."
    elif metrics['water_stress_average'] > 70:
         summary = f"Severe Regional Alert: The average water stress index has reached {metrics['water_stress_average']}%. Immediate drought mitigation protocols should be reviewed."
    else:
         summary = f"Overview: Analysis compiled across {metrics['total_villages']:,} villages. Current indicators show manageable priority levels with localized infrastructure disparities."

    response = {
        "summary": summary,
        "metrics": metrics,
        "alerts": alerts,
        "recommendations": recommendations,
        "source": "Python Local Analytics Engine (No External API)"
    }
    
    return jsonify(response)


# --- Local AI Chatbot (Ollama Integration) ---
OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen2.5:0.5b"

def get_system_context(ml_injection=None):
    """Generates a dynamic system prompt based on the live dataset."""
    metrics = extract_metrics(features)
    
    # If the ML model made a prediction, heavily emphasize it to the LLM
    ml_context = f"\nCRITICAL ML PREDICTION: {ml_injection}\nYou must clearly relay this specific prediction score to the user. Do not make up your own numbers." if ml_injection else ""
    
    context = (
        f"You are the official AI Assistant for the Ministry of Tribal Affairs (MoTA). "
        f"You help users understand the Forest Rights Act (FRA) implementation status. "
        f"Always be helpful, professional, and concise.\n\n"
        f"CURRENT STATE DATASET CONTEXT:\n"
        f"- Total Villages Tracked: {metrics['total_villages']:,}\n"
        f"- High Priority Villages: {metrics['high_priority_count']:,} (scoring over 60 on risk matrix)\n"
        f"- State Average Water Stress: {metrics['water_stress_average']}%\n"
        f"{ml_context}"
    )
    return context

@app.route('/api/chat', methods=['POST'])
def chat():
    """Proxies the chat request to the local Ollama instance with data context."""
    data = request.json
    user_prompt = data.get('message', '')
    
    if not user_prompt:
        return jsonify({"error": "No message provided"}), 400

    ml_injection = None
    
    # Intelligent ML Tool Interception
    # If the user asks for a prediction, try to parse the numbers (e.g. "predict for 50 water stress, 80 jjm, 100 pm kisan")
    if priority_model and "predict" in user_prompt.lower():
        # Very rough extraction: grab all numbers from the prompt to feed the model
        numbers = re.findall(r'\d+\.?\d*', user_prompt)
        if len(numbers) >= 3:
            try:
                # We expect values broadly in this order based on the training script:
                # water_stress, jjm_coverage, pm_kisan, fra_count
                w_stress = float(numbers[0]) / 100.0 if float(numbers[0]) > 1 else float(numbers[0])
                jjm = float(numbers[1])
                pmk = float(numbers[2])
                fra = float(numbers[3]) if len(numbers) > 3 else 0.0
                
                # Create the dataframe structure the model expects
                import pandas as pd
                pred_df = pd.DataFrame([{
                    'water_stress': w_stress,
                    'jjm_coverage': jjm,
                    'pm_kisan': pmk,
                    'fra_count': fra
                }])
                
                score = priority_model.predict(pred_df)[0]
                ml_injection = f"The custom Random Forest ML Model predicted a Priority Risk Score of {score:.2f} for this input."
                print(f"🧠 ML Prediction injected into Chatbot: {ml_injection}")
            except Exception as e:
                print(f"ML Parsing Error: {e}")

    payload = {
        "model": OLLAMA_MODEL,
        "system": get_system_context(ml_injection),
        "prompt": user_prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        
        return jsonify({
            "response": result.get("response", "No response generated."),
            "source": "Local Ollama Qwen 0.5B"
        })
        
    except requests.exceptions.RequestException as e:
        print(f"Ollama Connection Error: {e}")
        return jsonify({
            "error": "Could not reach local AI server. Make sure 'ollama run qwen2.5:0.5b' is running."
        }), 503

if __name__ == '__main__':
    # Railway passes the PORT env variable automatically
    port = int(os.environ.get("PORT", 5001))
    print("="*50)
    print(f"🚀 Pure Python Analytics Server Starting on Port {port}")
    print("Zero external APIs required.")
    print("="*50)
    app.run(host='0.0.0.0', port=port, debug=True)
