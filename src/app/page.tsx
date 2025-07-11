"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar";
import { GenreCard } from "@/components/cards/GenreCard";
import { genreService } from "@/services/firestore";
import { Genre } from "@/types";
import { testFirebaseConnection } from "@/utils/testFirebase";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Test Firebase connection on app start
    testFirebaseConnection();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await genreService.getAll();
        setGenres(genresData);
      } catch (error) {
        console.warn("Could not fetch genres:", error);
        // Set empty array if no genres exist or permission error
        setGenres([]);
      } finally {
        setLoadingGenres(false);
      }
    };

    if (user) {
      fetchGenres();
    }
  }, [user]);

  if (loading) {
    return <LoadingPage message="Loading your music..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 18
              ? "afternoon"
              : "evening"}
          </h1>
          <p className="text-gray-400">Discover your favorite music genres</p>
        </div>

        {loadingGenres ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-green-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading genres...</p>
            </div>
          </div>
        ) : genres.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h2 className="text-white text-xl mb-2">Welcome to Spoty!</h2>
              <p className="text-gray-400 mb-4">
                No music genres have been added yet.
              </p>
              {user?.role === "admin" ? (
                <div className="space-y-2">
                  <p className="text-green-400">
                    As an admin, you can add genres in the{" "}
                    <a href="/admin" className="underline">
                      admin panel
                    </a>
                    .
                  </p>
                  <p className="text-blue-400 text-sm">
                    Test uploads:{" "}
                    <a href="/test-upload" className="underline">
                      Upload Test Page
                    </a>
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">
                  Contact an administrator to start adding music content.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {genres.map((genre) => (
              <GenreCard key={genre.id} genre={genre} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
