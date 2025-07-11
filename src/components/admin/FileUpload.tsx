"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { cloudinaryService } from "@/services/cloudinary";
import toast from "react-hot-toast";
import Image from "next/image";

interface FileUploadProps {
  accept: string;
  label: string;
  type: "image" | "audio";
  onUpload: (url: string) => void;
  currentUrl?: string;
  disabled?: boolean;
}

export function FileUpload({
  accept,
  label,
  type,
  onUpload,
  currentUrl,
  disabled,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      const folder = type === "image" ? "spoty/images" : "spoty/audio";

      let result;
      if (type === "image") {
        result = await cloudinaryService.uploadImage(file, folder);
      } else {
        result = await cloudinaryService.uploadAudio(file, folder);
      }

      onUpload(result.secure_url);
      setPreview(result.secure_url);
      toast.success(`${type} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("Upload preset")) {
          toast.error(
            `Upload preset error: Please check your Cloudinary configuration`
          );
        } else if (error.message.includes("cloud name")) {
          toast.error(`Cloudinary configuration error: Invalid cloud name`);
        } else if (error.message.includes("Cloudinary error:")) {
          toast.error(
            `Cloudinary: ${error.message.replace("Cloudinary error: ", "")}`
          );
        } else {
          toast.error(`Failed to upload ${type}: ${error.message}`);
        }
      } else {
        toast.error(
          `Failed to upload ${type}. Please check your configuration.`
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setPreview(null);
    onUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {preview ? (
        <div className="relative">
          {type === "image" ? (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-800">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={clearFile}
                disabled={disabled}
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <span className="text-gray-300 text-sm truncate flex-1">
                Audio file uploaded
              </span>
              <button
                type="button"
                onClick={clearFile}
                disabled={disabled}
                className="ml-2 p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">
            {uploading ? `Uploading ${type}...` : `Click to upload ${type}`}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {type === "image"
              ? "PNG, JPG, GIF up to 10MB"
              : "MP3, WAV up to 10MB"}
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />
    </div>
  );
}
