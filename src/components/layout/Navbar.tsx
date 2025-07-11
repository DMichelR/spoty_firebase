"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Music, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-green-500" />
            <span className="text-white text-xl font-bold">Spoty</span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm">
              Welcome, {user.displayName || user.email}
            </span>

            {user.role === "admin" && (
              <Link
                href="/admin"
                className="text-gray-300 hover:text-white flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="text-gray-300 hover:text-white flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
