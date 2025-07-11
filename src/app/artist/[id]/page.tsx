"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar";
import { SongItem } from "@/components/songs/SongItem";
import { artistService, songService, genreService } from "@/services/firestore";
import { Artist, Song, Genre } from "@/types";
import { Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ArtistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const artistId = params.id as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!artistId) return;

      try {
        setLoading(true);
        const [artistData, songsData] = await Promise.all([
          artistService.getById(artistId),
          songService.getByArtist(artistId),
        ]);

        setArtist(artistData);
        setSongs(songsData);

        // Fetch genre info if artist exists
        if (artistData) {
          const genreData = await genreService.getById(artistData.genreId);
          setGenre(genreData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && artistId) {
      fetchData();
    }
  }, [user, artistId]);

  if (authLoading || loading) {
    return <LoadingPage message="Loading artist..." />;
  }

  if (!user) {
    return null;
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-white text-xl mb-2">Artist not found</h2>
            <Link
              href="/"
              className="text-green-500 hover:text-green-400 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            {genre && (
              <>
                <Link href={`/genre/${genre.id}`} className="hover:text-white">
                  {genre.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-white">{artist.name}</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-800">
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                Artist
              </p>
              <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
                {artist.name}
              </h1>
              {artist.description && (
                <p className="text-gray-400 text-lg max-w-2xl mb-4">
                  {artist.description}
                </p>
              )}
              <p className="text-gray-400 text-sm">
                {songs.length} song{songs.length !== 1 ? "s" : ""}
                {genre && ` • ${genre.name}`}
              </p>
            </div>
          </div>
        </div>

        {/* Songs List */}
        <div>
          {songs.length > 0 && (
            <div className="flex items-center space-x-6 mb-8">
              <button className="bg-green-500 hover:bg-green-600 text-black rounded-full p-4 transition-colors">
                <Play className="h-6 w-6 fill-current ml-0.5" />
              </button>
              <h2 className="text-white text-2xl font-bold">Popular</h2>
            </div>
          )}

          {songs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-white text-xl mb-2">No songs found</h3>
              <p className="text-gray-400">
                This artist doesn&apos;t have any songs yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {songs.map((song, index) => (
                <SongItem key={song.id} song={song} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
