"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar";
import { ArtistCard } from "@/components/cards/ArtistCard";
import { genreService, artistService } from "@/services/firestore";
import { Genre, Artist } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function GenrePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const genreId = params.id as string;

  const [genre, setGenre] = useState<Genre | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!genreId) return;

      try {
        setLoading(true);
        const [genreData, artistsData] = await Promise.all([
          genreService.getById(genreId),
          artistService.getByGenre(genreId),
        ]);

        setGenre(genreData);
        setArtists(artistsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && genreId) {
      fetchData();
    }
  }, [user, genreId]);

  if (authLoading || loading) {
    return <LoadingPage message="Loading artists..." />;
  }

  if (!user) {
    return null;
  }

  if (!genre) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-white text-xl mb-2">Genre not found</h2>
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
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to genres
          </Link>

          <div className="flex items-center space-x-6">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-gray-800">
              <Image
                src={genre.imageUrl}
                alt={genre.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                Genre
              </p>
              <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
                {genre.name}
              </h1>
              {genre.description && (
                <p className="text-gray-400 text-lg max-w-2xl">
                  {genre.description}
                </p>
              )}
              <p className="text-gray-400 text-sm mt-4">
                {artists.length} artist{artists.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Artists Grid */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-6">Artists</h2>

          {artists.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-white text-xl mb-2">No artists found</h3>
              <p className="text-gray-400">
                This genre doesn&apos;t have any artists yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
