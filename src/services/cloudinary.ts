import { CloudinaryUploadResult } from "@/types";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

// Upload preset for unsigned uploads - create this in your Cloudinary dashboard
const DEFAULT_UPLOAD_PRESET = "spoty_uploads"; // Replace with your custom upload preset name

export const cloudinaryService = {
  async uploadImage(
    file: File,
    folder: string
  ): Promise<CloudinaryUploadResult> {
    try {
      if (!CLOUDINARY_CLOUD_NAME) {
        throw new Error(
          "Cloudinary cloud name not configured. Please check your environment variables."
        );
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", DEFAULT_UPLOAD_PRESET);
      formData.append("folder", folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Cloudinary error response:", errorData);

        // Parse error response if possible
        try {
          const errorJson = JSON.parse(errorData);
          if (errorJson.error && errorJson.error.message) {
            throw new Error(`Cloudinary error: ${errorJson.error.message}`);
          }
        } catch {
          // If parsing fails, use the raw response
        }

        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}. Check your Cloudinary configuration.`
        );
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message || "Upload failed");
      }

      return result;
    } catch (error) {
      console.error("Error uploading image:", error);

      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.message.includes("Invalid upload preset")) {
          throw new Error(
            "Upload preset not found. Please check your Cloudinary configuration or create the upload preset."
          );
        } else if (error.message.includes("cloud name")) {
          throw new Error(
            "Invalid cloud name. Please verify your Cloudinary configuration."
          );
        }
      }

      throw error;
    }
  },

  async uploadAudio(
    file: File,
    folder: string
  ): Promise<CloudinaryUploadResult> {
    try {
      if (!CLOUDINARY_CLOUD_NAME) {
        throw new Error(
          "Cloudinary cloud name not configured. Please check your environment variables."
        );
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", DEFAULT_UPLOAD_PRESET);
      formData.append("folder", folder);
      formData.append("resource_type", "video"); // Cloudinary uses 'video' for audio files

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Cloudinary error response:", errorData);

        // Parse error response if possible
        try {
          const errorJson = JSON.parse(errorData);
          if (errorJson.error && errorJson.error.message) {
            throw new Error(`Cloudinary error: ${errorJson.error.message}`);
          }
        } catch {
          // If parsing fails, use the raw response
        }

        throw new Error(
          `Audio upload failed: ${response.status} ${response.statusText}. Check your Cloudinary configuration.`
        );
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message || "Audio upload failed");
      }

      return result;
    } catch (error) {
      console.error("Error uploading audio:", error);

      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.message.includes("Invalid upload preset")) {
          throw new Error(
            "Upload preset not found for audio. Please check your Cloudinary configuration."
          );
        } else if (error.message.includes("cloud name")) {
          throw new Error(
            "Invalid cloud name for audio upload. Please verify your Cloudinary configuration."
          );
        }
      }

      throw error;
    }
  },

  async deleteFile(
    publicId: string,
    resourceType: "image" | "video" = "image"
  ): Promise<void> {
    try {
      // This would require server-side implementation due to API secret
      // For now, we'll just log it
      console.log(`File deletion requested: ${publicId} (${resourceType})`);
      // TODO: Implement server-side deletion endpoint
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },

  getOptimizedImageUrl(
    publicId: string,
    width?: number,
    height?: number
  ): string {
    let transformations = "f_auto,q_auto";
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
  },

  getAudioUrl(publicId: string): string {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}`;
  },
};
