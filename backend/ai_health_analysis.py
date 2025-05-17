from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import random

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Mock NLP analysis function
def analyze_medical_report(text):
    # Simulate AI processing delay
    time.sleep(2)
    
    # Mock AI-generated insights
    return {
        "summary": "The patient shows signs of mild hypertension. Recommended lifestyle changes include regular exercise and a low-sodium diet.",
        "key_insights": {
            "diagnosis": ["Mild Hypertension"],
            "treatments": ["Lifestyle modifications"],
            "medications": ["None prescribed"],
            "follow_up": "Follow-up in 3 months"
        },
        "confidence_score": random.uniform(0.85, 0.95)  # Mock confidence score
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        # Get the report text from the request
        data = request.json
        report_text = data.get('text', '')

        if not report_text:
            return jsonify({"error": "No report text provided"}), 400

        # Perform AI analysis
        analysis_result = analyze_medical_report(report_text)

        return jsonify({
            "status": "success",
            "analysis": analysis_result
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return jsonify({"message": "AI Health Analysis API is running!"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)