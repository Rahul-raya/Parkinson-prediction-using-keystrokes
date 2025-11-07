from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
import joblib, os, traceback



SEQ_LEN = int(os.environ.get("SEQ_LEN", 500))
MODEL_PATH = os.environ.get("MODEL_PATH", "inception_time_v2_model.keras")
SCALER_PATH = os.environ.get("SCALER_PATH", "scaler.pkl")  


app = Flask(__name__)
CORS(app)  

print("Loading model:", MODEL_PATH)
model = load_model(MODEL_PATH)
print("Model loaded.")

scaler = None
if os.path.exists(SCALER_PATH):
    try:
        scaler = joblib.load(SCALER_PATH)
        print("Scaler loaded:", SCALER_PATH)
    except Exception as e:
        print("Scaler load failed:", e)

# ----------------------------
# PREPROCESS
# ----------------------------
def preprocess_input(keystrokes, seq_len=SEQ_LEN):
    """
    keystrokes: list of dicts with keys:
      'Hold time', 'Flight time', 'Latency time'   (numbers in ms)
    returns np.array shaped (1, seq_len, 3)
    """
    try:
        arr = np.array([
            [float(k['Hold time']), float(k['Flight time']), float(k['Latency time'])]
            for k in keystrokes
        ], dtype=np.float32)

        if scaler is not None:
            arr = scaler.transform(arr)
        n, f = arr.shape
        if n < seq_len:
            pad = np.zeros((seq_len - n, f), dtype=np.float32)
            arr = np.vstack([arr, pad])
        elif n > seq_len:
            arr = arr[:seq_len]

        return arr.reshape(1, seq_len, f)
    except Exception as e:
        print("Preprocess error:", e)
        traceback.print_exc()
        return None

# ----------------------------
# ROUTES
# ----------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

@app.route("/predict", methods=["POST"])
def predict():
    try:
        payload = request.get_json(force=True)
        ks = payload.get("keystrokes", None)
        if not ks or not isinstance(ks, list):
            return jsonify({"error": "keystrokes must be a non-empty list"}), 400

        x = preprocess_input(ks)
        if x is None:
            return jsonify({"error": "preprocessing failed"}), 400

        pred = model.predict(x)
        prob = float(pred[0][0])
        label = "Parkinson’s Detected" if prob >= 0.5 else "Control (Healthy)"

        if prob >= 0.85:
            severity = "Severe"
        elif prob >= 0.65:
            severity = "Moderate"
        elif prob >= 0.5:
            severity = "Mild"
        else:
            severity = "None"

        return jsonify({
            "label": label,
            "probability": round(prob, 4),
            "severity": severity
        }), 200
    except Exception as e:
        print("Prediction error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # local dev
    app.run(host="0.0.0.0", port=5000, debug=True)
