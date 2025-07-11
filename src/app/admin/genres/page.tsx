"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar";
import { genreService } from "@/services/firestore";
import { Genre } from "@/types";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function GenresAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

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
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchGenres();
    }
  }, [user]);

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleting(id);
    try {
      await genreService.delete(id);
      setGenres(genres.filter((genre) => genre.id !== id));
      toast.success("Genre deleted successfully");
    } catch (error) {
      console.error("Error deleting genre:", error);
      toast.error("Failed to delete genre");
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading || loading) {
    return <LoadingPage message="Loading genres..." />;
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
                Manage Genres
              </h1>
              <p className="text-gray-400">Add, edit, or remove music genres</p>
            </div>
            <Link
              href="/admin/genres/new"
              className="inline-flex items-center px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Genre
            </Link>
          </div>
        </div>

        {genres.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-white text-xl mb-2">No genres found</h2>
            <p className="text-gray-400 mb-4">
              Get started by creating your first genre.
            </p>
            <Link
              href="/admin/genres/new"
              className="inline-flex items-center px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Genre
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {genres.map((genre) => (
              <div
                key={genre.id}
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors"
              >
                <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={genre.imageUrl}
                    alt={genre.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <h3 className="text-white font-semibold text-lg truncate">
                    {genre.name}
                  </h3>
                  {genre.description && (
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {genre.description}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs">
                    Created {genre.createdAt.toLocaleDateString()}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/admin/genres/edit/${genre.id}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(genre.id, genre.name)}
                    disabled={deleting === genre.id}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deleting === genre.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
