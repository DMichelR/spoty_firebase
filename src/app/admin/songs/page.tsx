"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar";
import { songService, artistService, genreService } from "@/services/firestore";
import { Song, Artist, Genre } from "@/types";
import { Plus, Edit, Trash2, ArrowLeft, Play, Pause } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SongsAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [playingSong, setPlayingSong] = useState<string | null>(null);

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
        const [songsData, artistsData, genresData] = await Promise.all([
          songService.getAll(),
          artistService.getAll(),
          genreService.getAll(),
        ]);
        setSongs(songsData);
        setArtists(artistsData);
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load songs");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  const handleDelete = async (id: string, title: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleting(id);
    try {
      await songService.delete(id);
      setSongs(songs.filter((song) => song.id !== id));
      toast.success("Song deleted successfully");
    } catch (error) {
      console.error("Error deleting song:", error);
      toast.error("Failed to delete song");
    } finally {
      setDeleting(null);
    }
  };

  const getArtistInfo = (artistId: string) => {
    const artist = artists.find((a) => a.id === artistId);
    if (!artist) return { name: "Unknown Artist", genre: "Unknown Genre" };

    const genre = genres.find((g) => g.id === artist.genreId);
    return {
      name: artist.name,
      genre: genre?.name || "Unknown Genre",
    };
  };

  const togglePlay = (songId: string) => {
    if (playingSong === songId) {
      setPlayingSong(null);
    } else {
      setPlayingSong(songId);
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return "--:--";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (authLoading || loading) {
    return <LoadingPage message="Loading songs..." />;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to admin
          </Link>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-white text-3xl font-bold mb-2">
                Manage Songs
              </h1>
              <p className="text-gray-400">Add, edit, or remove songs</p>
            </div>
            <Link
              href="/admin/songs/new"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Song
            </Link>
          </div>
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-white text-xl mb-2">No songs found</h2>
            <p className="text-gray-400 mb-4">
              Get started by uploading your first song.
            </p>
            <Link
              href="/admin/songs/new"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Song
            </Link>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-white text-lg font-semibold">All Songs</h2>
            </div>

            <div className="divide-y divide-gray-800">
              {songs.map((song, index) => {
                const artistInfo = getArtistInfo(song.artistId);
                const isPlaying = playingSong === song.id;

                return (
                  <div
                    key={song.id}
                    className="p-4 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Play/Pause Button */}
                      <div className="flex items-center justify-center w-10">
                        <span className="text-gray-400 text-sm group-hover:hidden">
                          {index + 1}
                        </span>
                        <button
                          onClick={() => togglePlay(song.id)}
                          className="w-8 h-8 bg-green-500 rounded-full hover:bg-green-400 transition-colors flex items-center justify-center"
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4 text-black fill-current" />
                          ) : (
                            <Play className="h-4 w-4 text-black fill-current ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Song Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {song.title}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                          {artistInfo.name} • {artistInfo.genre}
                        </p>
                      </div>

                      {/* Duration */}
                      <div className="text-gray-400 text-sm">
                        {formatDuration(song.duration)}
                      </div>

                      {/* Created Date */}
                      <div className="text-gray-400 text-sm">
                        {song.createdAt.toLocaleDateString()}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/songs/edit/${song.id}`}
                          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(song.id, song.title)}
                          disabled={deleting === song.id}
                          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Hidden Audio Element */}
                    {isPlaying && (
                      <audio
                        src={song.audioUrl}
                        controls
                        autoPlay
                        className="w-full mt-3"
                        onEnded={() => setPlayingSong(null)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
