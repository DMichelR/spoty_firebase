"use client";

import { Song } from "@/types";
import { Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

interface SongItemProps {
  song: Song;
  index: number;
}

export function SongItem({ song, index }: SongItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="group flex items-center p-2 rounded-lg hover:bg-gray-800 transition-colors">
      {/* Play/Pause Button */}
      <div className="flex items-center justify-center w-10 h-10 mr-4">
        <span className="text-gray-400 text-sm group-hover:hidden">
          {index + 1}
        </span>
        <button
          onClick={togglePlay}
          className="hidden group-hover:flex items-center justify-center w-8 h-8 bg-green-500 rounded-full hover:bg-green-400 transition-colors"
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
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium truncate">{song.title}</h4>
            {isPlaying && (
              <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-green-500 h-1 rounded-full transition-all duration-100"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </div>
          {!isPlaying && (
            <span className="text-gray-400 text-sm">
              {song.duration ? formatTime(song.duration) : "--:--"}
            </span>
          )}
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={song.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
    </div>
  );
}
