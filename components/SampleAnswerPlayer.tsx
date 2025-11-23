"use client";

import { useState, useRef, useEffect } from "react";

interface SampleAnswerPlayerProps {
  audioPath?: string;
  sampleAnswer?: string;
  className?: string;
}

export default function SampleAnswerPlayer({
  audioPath,
  sampleAnswer,
  className = "",
}: SampleAnswerPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setError("오디오를 재생할 수 없습니다.");
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [audioPath]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
        setError("오디오 재생에 실패했습니다.");
      });
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  if (!audioPath && !sampleAnswer) {
    return (
      <div className={`bg-indigo-50 rounded-lg p-4 space-y-3 ${className}`}>
        <h4 className="font-semibold text-indigo-900">모범 답안</h4>
        <p className="text-gray-600 text-sm">모범 답안이 제공되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <div className={`bg-indigo-50 rounded-lg p-4 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-indigo-900">모범 답안</h4>
        {audioPath && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <button
              onClick={togglePlay}
              disabled={!!error}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <span>▶</span>
                  <span>Play</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {audioPath && (
        <audio ref={audioRef} src={audioPath} preload="metadata" />
      )}

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      {sampleAnswer && (
        <div className="bg-white rounded p-3 text-gray-700 leading-relaxed">
          <p className="whitespace-pre-wrap">{sampleAnswer}</p>
        </div>
      )}

      {audioPath && duration > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}

