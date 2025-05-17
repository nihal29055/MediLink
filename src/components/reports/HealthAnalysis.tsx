import React, { useState } from "react";
import axios from "axios";

const HealthAnalysis = () => {
    const [reportText, setReportText] = useState("");
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);

    const analyzeReport = async () => {
        try {
            const response = await axios.post("http://localhost:5001/analyze", { text: reportText });
            setAnalysisResult(response.data.analysis);
            setError(null);
        } catch (err) {
            console.error("Error analyzing report:", err);
            setError("Failed to analyze the report. Please try again.");
        }
    };

    return (
        <div>
            <h1>AI Health Analysis</h1>
            <textarea
                placeholder="Enter medical report text here..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                rows="6"
                cols="50"
            />
            <br />
            <button onClick={analyzeReport}>Analyze Report</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {analysisResult && (
                <div>
                    <h2>Analysis Result</h2>
                    <p><strong>Summary:</strong> {analysisResult.summary}</p>
                    <h3>Key Insights</h3>
                    <ul>
                        <li><strong>Diagnosis:</strong> {analysisResult.key_insights.diagnosis.join(", ")}</li>
                        <li><strong>Treatments:</strong> {analysisResult.key_insights.treatments.join(", ")}</li>
                        <li><strong>Medications:</strong> {analysisResult.key_insights.medications.join(", ")}</li>
                        <li><strong>Follow-Up:</strong> {analysisResult.key_insights.follow_up}</li>
                    </ul>
                    <p><strong>Confidence Score:</strong> {analysisResult.confidence_score.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default HealthAnalysis;