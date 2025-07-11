"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar";
import { FileUpload } from "@/components/admin/FileUpload";
import { genreService } from "@/services/firestore";
import { Genre } from "@/types";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewGenrePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    } else if (!authLoading && user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Genre name is required");
      return;
    }

    if (!formData.imageUrl) {
      toast.error("Genre image is required");
      return;
    }

    setLoading(true);
    try {
      const genreData: Omit<Genre, "id" | "createdAt"> = {
        name: formData.name.trim(),
        imageUrl: formData.imageUrl,
      } as Omit<Genre, "id" | "createdAt">;

      // Only include description if it's not empty
      if (formData.description.trim()) {
        genreData.description = formData.description.trim();
      }

      await genreService.create(genreData);
      toast.success("Genre created successfully");
      router.push("/admin/genres");
    } catch (error) {
      console.error("Error creating genre:", error);
      toast.error("Failed to create genre");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (authLoading) {
    return <LoadingPage message="Loading..." />;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin/genres"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to genres
          </Link>

          <h1 className="text-white text-3xl font-bold mb-2">
            Create New Genre
          </h1>
          <p className="text-gray-400">Add a new music genre to your library</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-lg p-6 space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Genre Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter genre name"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter genre description (optional)"
            />
          </div>

          <FileUpload
            accept="image/*"
            label="Genre Image *"
            type="image"
            currentUrl={formData.imageUrl}
            onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
            disabled={loading}
          />

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.imageUrl}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Creating..." : "Create Genre"}
            </button>
            <Link
              href="/admin/genres"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
