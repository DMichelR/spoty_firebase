"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar";
import { FileUpload } from "@/components/admin/FileUpload";
import { songService, artistService, genreService } from "@/services/firestore";
import { Artist, Genre } from "@/types";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewSongPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    audioUrl: "",
    artistId: "",
    duration: 0,
  });
  const [artists, setArtists] = useState<Artist[]>([]);
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
    const fetchData = async () => {
      try {
        const [artistsData, genresData] = await Promise.all([
          artistService.getAll(),
          genreService.getAll(),
        ]);
        setArtists(artistsData);
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setInitialLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Song title is required");
      return;
    }

    if (!formData.artistId) {
      toast.error("Artist is required");
      return;
    }

    if (!formData.audioUrl) {
      toast.error("Audio file is required");
      return;
    }

    setLoading(true);
    try {
      await songService.create({
        title: formData.title.trim(),
        audioUrl: formData.audioUrl,
        artistId: formData.artistId,
        duration: formData.duration || undefined,
      });
      toast.success("Song created successfully");
      router.push("/admin/songs");
    } catch (error) {
      console.error("Error creating song:", error);
      toast.error("Failed to create song");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "duration" ? parseFloat(value) || 0 : value,
    });
  };

  const getArtistsByGenre = () => {
    const artistsByGenre: { [key: string]: Artist[] } = {};
    artists.forEach((artist) => {
      const genre = genres.find((g) => g.id === artist.genreId);
      const genreName = genre?.name || "Unknown";
      if (!artistsByGenre[genreName]) {
        artistsByGenre[genreName] = [];
      }
      artistsByGenre[genreName].push(artist);
    });
    return artistsByGenre;
  };

  if (authLoading || initialLoading) {
    return <LoadingPage message="Loading..." />;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  if (artists.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-white text-xl mb-2">No artists available</h2>
            <p className="text-gray-400 mb-4">
              You need to create at least one artist before adding songs.
            </p>
            <Link
              href="/admin/artists/new"
              className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Create Artist First
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const artistsByGenre = getArtistsByGenre();

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin/songs"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to songs
          </Link>

          <h1 className="text-white text-3xl font-bold mb-2">
            Upload New Song
          </h1>
          <p className="text-gray-400">Add a new song to your library</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-lg p-6 space-y-6"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Song Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter song title"
            />
          </div>

          <div>
            <label
              htmlFor="artistId"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Artist *
            </label>
            <select
              id="artistId"
              name="artistId"
              required
              value={formData.artistId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an artist</option>
              {Object.entries(artistsByGenre).map(
                ([genreName, genreArtists]) => (
                  <optgroup key={genreName} label={genreName}>
                    {genreArtists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.name}
                      </option>
                    ))}
                  </optgroup>
                )
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Duration (seconds)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="0"
              step="0.1"
              value={formData.duration || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter duration in seconds (optional)"
            />
          </div>

          <FileUpload
            accept="audio/*"
            label="Audio File *"
            type="audio"
            currentUrl={formData.audioUrl}
            onUpload={(url) => setFormData({ ...formData, audioUrl: url })}
            disabled={loading}
          />

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={
                loading ||
                !formData.title.trim() ||
                !formData.artistId ||
                !formData.audioUrl
              }
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Uploading..." : "Upload Song"}
            </button>
            <Link
              href="/admin/songs"
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
