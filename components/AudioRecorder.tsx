"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onError?: (error: string) => void;
}

export default function AudioRecorder({
  onRecordingComplete,
  isRecording,
  onStartRecording,
  onStopRecording,
  onError,
}: AudioRecorderProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const onRecordingCompleteRef = useRef(onRecordingComplete);
  const onStartRecordingRef = useRef(onStartRecording);
  const onStopRecordingRef = useRef(onStopRecording);
  const onErrorRef = useRef(onError);

  // Keep refs up to date
  useEffect(() => {
    onRecordingCompleteRef.current = onRecordingComplete;
    onStartRecordingRef.current = onStartRecording;
    onStopRecordingRef.current = onStopRecording;
    onErrorRef.current = onError;
  }, [onRecordingComplete, onStartRecording, onStopRecording, onError]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);

      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        console.warn("audio/webm;codecs=opus not supported, trying default");
      }

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecordingCompleteRef.current(audioBlob);
        chunksRef.current = [];
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      onStartRecordingRef.current();
    } catch (error) {
      console.error("Error starting recording:", error);
      setHasPermission(false);
      const errorMessage = 
        (error as Error).name === "NotAllowedError" || (error as Error).name === "PermissionDeniedError"
          ? "마이크 접근 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요."
          : "마이크를 사용할 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.";
      onErrorRef.current?.(errorMessage);
      onStopRecordingRef.current();
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      onStopRecordingRef.current();
    }
  }, [mediaRecorder]);

  useEffect(() => {
    if (isRecording && !mediaRecorder) {
      startRecording();
    } else if (!isRecording && mediaRecorder) {
      stopRecording();
    }
  }, [isRecording, mediaRecorder, startRecording, stopRecording]);

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {isRecording ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-sm sm:text-base text-red-600 font-semibold">Recording...</span>
        </div>
      ) : (
        <span className="text-sm sm:text-base text-gray-500">Ready to record</span>
      )}
    </div>
  );
}

