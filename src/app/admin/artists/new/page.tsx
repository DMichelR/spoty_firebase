"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar";
import { FileUpload } from "@/components/admin/FileUpload";
import { artistService, genreService } from "@/services/firestore";
import { Genre } from "@/types";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewArtistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    genreId: "",
  });
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    } else if (!authLoading && user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await genreService.getAll();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
        toast.error("Failed to load genres");
      } finally {
        setInitialLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchGenres();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Artist name is required");
      return;
    }

    if (!formData.genreId) {
      toast.error("Genre is required");
      return;
    }

    if (!formData.imageUrl) {
      toast.error("Artist image is required");
      return;
    }

    setLoading(true);
    try {
      await artistService.create({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl,
        genreId: formData.genreId,
      });
      toast.success("Artist created successfully");
      router.push("/admin/artists");
    } catch (error) {
      console.error("Error creating artist:", error);
      toast.error("Failed to create artist");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (authLoading || initialLoading) {
    return <LoadingPage message="Loading..." />;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  if (genres.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-white text-xl mb-2">No genres available</h2>
            <p className="text-gray-400 mb-4">
              You need to create at least one genre before adding artists.
            </p>
            <Link
              href="/admin/genres/new"
              className="inline-flex items-center px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors"
            >
              Create Genre First
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin/artists"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to artists
          </Link>

          <h1 className="text-white text-3xl font-bold mb-2">
            Create New Artist
          </h1>
          <p className="text-gray-400">Add a new artist to your library</p>
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
              Artist Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter artist name"
            />
          </div>

          <div>
            <label
              htmlFor="genreId"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Genre *
            </label>
            <select
              id="genreId"
              name="genreId"
              required
              value={formData.genreId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select a genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
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
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter artist description (optional)"
            />
          </div>

          <FileUpload
            accept="image/*"
            label="Artist Image *"
            type="image"
            currentUrl={formData.imageUrl}
            onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
            disabled={loading}
          />

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={
                loading ||
                !formData.name.trim() ||
                !formData.genreId ||
                !formData.imageUrl
              }
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Creating..." : "Create Artist"}
            </button>
            <Link
              href="/admin/artists"
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
