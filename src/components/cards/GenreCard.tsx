"use client";

import { Genre } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

interface GenreCardProps {
  genre: Genre;
}

export function GenreCard({ genre }: GenreCardProps) {
  return (
    <Link
      href={`/genre/${genre.id}`}
      className="group relative bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition-colors duration-200"
    >
      <div className="relative aspect-square mb-4 overflow-hidden rounded-md">
        <Image
          src={genre.imageUrl}
          alt={genre.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
            <Play className="h-6 w-6 text-black fill-current" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold text-lg mb-1 truncate">
          {genre.name}
        </h3>
        {genre.description && (
          <p className="text-gray-400 text-sm line-clamp-2">
            {genre.description}
          </p>
        )}
      </div>
    </Link>
  );
}
