import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioStatus,
} from 'expo-audio';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';

type AudioState = {
  id: string | null;
  isPlaying: boolean;
  isLoading: boolean;
};

let globalPlayer: AudioPlayer | null = null;
let statusListener: { remove: () => void } | null = null;
let sequenceCancelled = false;

function destroyGlobalPlayer() {
  if (statusListener) {
    statusListener.remove();
    statusListener = null;
  }

  if (globalPlayer) {
    try {
      globalPlayer.pause();
      globalPlayer.remove();
    } catch {
      // ignore cleanup errors
    }
    globalPlayer = null;
  }
}

export function useAudioPlayer() {
  const [state, setState] = useState<AudioState>({
    id: null,
    isPlaying: false,
    isLoading: false,
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    }).catch(() => undefined);

    return () => {
      mounted.current = false;
      destroyGlobalPlayer();
      Speech.stop();
    };
  }, []);

  const stop = useCallback(async () => {
    sequenceCancelled = true;
    destroyGlobalPlayer();
    Speech.stop();
    if (mounted.current) {
      setState({ id: null, isPlaying: false, isLoading: false });
    }
  }, []);

  const playUrlAndWait = useCallback((id: string, url: string): Promise<void> => {
    return new Promise((resolve) => {
      if (sequenceCancelled) {
        resolve();
        return;
      }

      try {
        const player = createAudioPlayer(url, { crossOrigin: 'anonymous' });
        globalPlayer = player;

        if (statusListener) statusListener.remove();
        statusListener = player.addListener(
          'playbackStatusUpdate',
          (status: AudioStatus) => {
            if (!mounted.current) return;

            if (status.didJustFinish || sequenceCancelled) {
              destroyGlobalPlayer();
              resolve();
            }
          }
        );

        if (mounted.current) {
          setState({ id, isPlaying: true, isLoading: false });
        }
        player.play();
      } catch {
        resolve();
      }
    });
  }, []);

  const playUrl = useCallback(
    async (id: string, url: string) => {
      if (state.id === id && state.isPlaying) {
        await stop();
        return;
      }

      await stop();
      if (mounted.current) setState({ id, isPlaying: false, isLoading: true });

      try {
        const player = createAudioPlayer(url, { crossOrigin: 'anonymous' });
        globalPlayer = player;

        statusListener = player.addListener(
          'playbackStatusUpdate',
          (status: AudioStatus) => {
            if (!mounted.current) return;

            if (status.didJustFinish) {
              destroyGlobalPlayer();
              setState({ id: null, isPlaying: false, isLoading: false });
              return;
            }

            setState({
              id,
              isPlaying: status.playing,
              isLoading: !status.isLoaded || status.isBuffering,
            });
          }
        );

        player.play();

        if (mounted.current) {
          setState({ id, isPlaying: true, isLoading: false });
        }
      } catch {
        destroyGlobalPlayer();
        if (mounted.current) {
          setState({ id: null, isPlaying: false, isLoading: false });
        }
      }
    },
    [state.id, state.isPlaying, stop]
  );

  const playSequence = useCallback(
    async (
      id: string,
      urls: string[],
      onStep?: (index: number) => void,
      onComplete?: () => void
    ) => {
      if (state.id === id && state.isPlaying) {
        await stop();
        onComplete?.();
        return;
      }

      sequenceCancelled = false;
      await stop();
      Speech.stop();

      if (!urls.length) return;

      if (mounted.current) setState({ id, isPlaying: true, isLoading: true });

      for (let i = 0; i < urls.length; i++) {
        if (sequenceCancelled) break;
        onStep?.(i);
        if (mounted.current) {
          setState({ id, isPlaying: true, isLoading: false });
        }
        await playUrlAndWait(id, urls[i]);
      }

      if (mounted.current) {
        setState({ id: null, isPlaying: false, isLoading: false });
      }
      onComplete?.();
    },
    [state.id, state.isPlaying, stop, playUrlAndWait]
  );

  const speakArabic = useCallback(
    async (id: string, text: string) => {
      if (state.id === id && state.isPlaying) {
        await stop();
        return;
      }

      await stop();
      if (mounted.current) setState({ id, isPlaying: true, isLoading: false });

      Speech.speak(text, {
        language: 'ar-SA',
        rate: 0.85,
        onDone: () => {
          if (mounted.current) setState({ id: null, isPlaying: false, isLoading: false });
        },
        onStopped: () => {
          if (mounted.current) setState({ id: null, isPlaying: false, isLoading: false });
        },
        onError: () => {
          if (mounted.current) setState({ id: null, isPlaying: false, isLoading: false });
        },
      });
    },
    [state.id, state.isPlaying, stop]
  );

  return {
    activeId: state.id,
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    playUrl,
    playSequence,
    speakArabic,
    stop,
  };
}
