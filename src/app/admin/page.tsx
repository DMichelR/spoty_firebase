"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar";
import { Music, Users, Disc, Plus } from "lucide-react";
import Link from "next/link";
import { genreService, artistService, songService } from "@/services/firestore";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    genres: 0,
    artists: 0,
    songs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    } else if (!authLoading && user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [genres, artists, songs] = await Promise.all([
          genreService.getAll(),
          artistService.getAll(),
          songService.getAll(),
        ]);

        setStats({
          genres: genres.length,
          artists: artists.length,
          songs: songs.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchStats();
    }
  }, [user]);

  if (authLoading || loading) {
    return <LoadingPage message="Loading admin panel..." />;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const adminCards = [
    {
      title: "Genres",
      count: stats.genres,
      icon: Music,
      href: "/admin/genres",
      color: "bg-blue-500",
    },
    {
      title: "Artists",
      count: stats.artists,
      icon: Users,
      href: "/admin/artists",
      color: "bg-purple-500",
    },
    {
      title: "Songs",
      count: stats.songs,
      icon: Disc,
      href: "/admin/songs",
      color: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage your music library</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                    <p className="text-white text-3xl font-bold">
                      {card.count}
                    </p>
                  </div>
                  <div
                    className={`${card.color} rounded-lg p-3 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-white text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/admin/genres/new"
              className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Plus className="h-5 w-5 text-green-500" />
              <span className="text-white">Add Genre</span>
            </Link>
            <Link
              href="/admin/artists/new"
              className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Plus className="h-5 w-5 text-purple-500" />
              <span className="text-white">Add Artist</span>
            </Link>
            <Link
              href="/admin/songs/new"
              className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Plus className="h-5 w-5 text-blue-500" />
              <span className="text-white">Add Song</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
