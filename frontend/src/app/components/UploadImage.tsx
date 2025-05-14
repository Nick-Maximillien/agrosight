'use client';
import React, { useState } from "react";
import { useAuth } from "context/AuthContext";
import axios from "axios";

interface AnalysisResult {
    image_url: string;
    filename: string;
    analysis: string | object;
}

const UploadImage = () => {
    const { token } = useAuth();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
            setAnalysisResults([]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!token) {
            alert("You must be logged in to upload.");
            return;
        }
        if (selectedImages.length === 0) {
            setError("No images selected.");
            return;
        }

        const formData = new FormData();
        selectedImages.forEach((image) => formData.append('images', image));

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8000/upload-images/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setAnalysisResults(response.data.results);
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.response?.data?.error || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Upload Images for Analysis</h2>

            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
            />

            <button
                onClick={handleUpload}
                disabled={loading}
                style={{ margin: '10px 0' }}
            >
                {loading ? 'Uploading...' : 'Analyze'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {analysisResults.length > 0 && (
                <div>
                    <h3>Image Analysis Results</h3>
                    {analysisResults.map((result, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <img
                                src={result.image_url || `/media/${result.filename}`}
                                alt={`upload-${index}`}
                                width={200}
                            />
                            <p><strong>Filename:</strong> {result.filename}</p>
                            <p className="analysis">
                                <strong>Analysis:</strong>{" "}
                                {typeof result.analysis === 'object'
                                    ? JSON.stringify(result.analysis, null, 2)
                                    : result.analysis}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UploadImage;
