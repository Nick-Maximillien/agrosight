"use client"
import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useAuth } from "context/AuthContext";

interface AnalysisResult {
    class: string;
    confidence: number;
    x_center: number;
    y_center: number;
    width: number;
    height: number;
}

export default function ImageUpload() {
    const { token } = useAuth();
    const [ images, setImages ] = useState<File[]>([]);
    const [ results, setResults ] = useState<AnalysisResult[] | null>(null)

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();

        images.forEach((image) => {
            formData.append("images", image)
        });

        try {
            const response = await fetch("http://localhost:8001/upload-images/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data: AnalysisResult[] = await response.json();
                setResults(data);
            } else {
                console.error("Error in uploading images");
            }
        } catch (error) {
            console.error("Error in uploading images")
        }
    };

    return (
        <div>
            <h1>Upload Images for Analysis</h1>
            <form onSubmit={handleSubmit}>
                <input 
                   type="file"
                   multiple
                   onChange={handleImageChange} 
                />
                <button type="submit">Upload</button>
            </form>
            {results && (
                <div>
                    <h2>Analysis Results:</h2>
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}