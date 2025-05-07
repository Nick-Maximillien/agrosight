'use client';
import React, { useState } from "react";
import { useAuth } from "context/AuthContext";
import axios from "axios";

interface AnalysisResult {
    image_url: string;
    filename: string;
    analysis: string;
}

const UploadImage = () => {
    const { token } = useAuth();
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [analysisResults, setAnalysisResults]  = useState<AnalysisResult[]>([])
    const [loading, setLoading] = useState(false)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (!token || selectedImages.length === 0) return;

        const formData = new FormData();
        selectedImages.forEach((image) => formData.append('images', image));

        setLoading(true)

        try {
            const res = await axios.post('http://localhost:8000/upload-images/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/formdata',
                },
            });

            setAnalysisResults(res.data.results);
        } catch (error) {
            console.error('Failed to upload:', error)
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
            >
                {loading ? 'Uploading...' : 'Analyze'}
            </button>

            {analysisResults.length > 0 && (
                <div>
                    <h3>Image Analysis Results</h3>
                    {analysisResults.map((result, index) => (
                        <div key={index}>
                            <img src={result.image_url} alt={`upload-${index}`} width={200} />
                            <p><b>Filename:</b> {result.filename}</p>
                            <p className="analysis"><b>Analysis:</b> {typeof result.analysis === 'object' ? JSON.stringify(result.analysis) : result.analysis}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UploadImage