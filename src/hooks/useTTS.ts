import { useEffect, useRef, useState, useCallback } from 'react';
import Speech from 'speak-tts';

const LANG_MAP: Record<string, string> = {
  he: 'he-IL',
  en: 'en-US',
  ru: 'ru-RU',
};

export function useTTS(text: string, lang: string) {
  const speechRef = useRef<Speech | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Initialize (or reinitialize) speak-tts when lang changes
  useEffect(() => {
    // Stop any ongoing speech before reinit
    if (speechRef.current) {
      speechRef.current.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);

    const speech = new Speech();
    speechRef.current = speech;

    speech.init({
      lang: LANG_MAP[lang] ?? 'en-US',
      splitSentences: false,
    }).catch((e: unknown) => {
      console.warn('speak-tts init failed:', e);
    });

    return () => {
      speech.cancel();
    };
  }, [lang]);

  const play = useCallback(() => {
    const speech = speechRef.current;
    if (!speech) return;

    if (isPaused) {
      speech.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    setProgress(0);
    speech.speak({
      text,
      queue: false,
      listeners: {
        onstart: () => {
          setIsPlaying(true);
          setIsPaused(false);
        },
        onend: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setProgress(100);
        },
        onboundary: (event: SpeechSynthesisEvent) => {
          if (text.length > 0) {
            setProgress(Math.min(100, Math.round((event.charIndex / text.length) * 100)));
          }
        },
      },
    }).catch((e: unknown) => {
      console.warn('speak-tts speak failed:', e);
      setIsPlaying(false);
    });
  }, [text, isPaused]);

  const pause = useCallback(() => {
    speechRef.current?.pause();
    setIsPlaying(false);
    setIsPaused(true);
  }, []);

  const stop = useCallback(() => {
    speechRef.current?.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
  }, []);

  return { play, pause, stop, isPlaying, isPaused, progress };
}
