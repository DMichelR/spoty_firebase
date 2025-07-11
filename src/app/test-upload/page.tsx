"use client";

import { useState } from "react";
import { FileUpload } from "@/components/admin/FileUpload";
import { Toaster } from "react-hot-toast";

export default function TestUploadPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          🧪 Test Cloudinary Upload
        </h1>

        <div className="space-y-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Image Upload Test
            </h2>
            <FileUpload
              accept="image/*"
              label="Test Image Upload"
              type="image"
              onUpload={setImageUrl}
              currentUrl={imageUrl}
            />
            {imageUrl && (
              <div className="mt-4">
                <p className="text-green-400 text-sm">
                  ✅ Image uploaded successfully!
                </p>
                <p className="text-gray-400 text-xs break-all">{imageUrl}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Audio Upload Test
            </h2>
            <FileUpload
              accept="audio/*"
              label="Test Audio Upload"
              type="audio"
              onUpload={setAudioUrl}
              currentUrl={audioUrl}
            />
            {audioUrl && (
              <div className="mt-4">
                <p className="text-green-400 text-sm">
                  ✅ Audio uploaded successfully!
                </p>
                <p className="text-gray-400 text-xs break-all">{audioUrl}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Configuration Info
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <span className="text-gray-500">Cloud Name:</span>{" "}
                {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
                  "Not configured"}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500">Upload Preset:</span> ml_default
                (Cloudinary default)
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500">Status:</span> Ready for testing
              </p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Instructions
            </h2>
            <div className="text-gray-300 space-y-2 text-sm">
              <p>1. Try uploading a small image (JPG, PNG, GIF)</p>
              <p>2. Try uploading a small audio file (MP3, WAV)</p>
              <p>3. Check the browser console for any errors</p>
              <p>4. If uploads fail, check the CLOUDINARY_FIX.md guide</p>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
