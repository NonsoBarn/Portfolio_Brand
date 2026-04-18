// Spotify Web Playback SDK type declarations
interface Window {
  onSpotifyWebPlaybackSDKReady: () => void;
  Spotify: typeof Spotify;
}

declare namespace Spotify {
  interface Player {
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(event: "ready", cb: (data: { device_id: string }) => void): void;
    addListener(event: "not_ready", cb: (data: { device_id: string }) => void): void;
    addListener(event: "player_state_changed", cb: (state: PlaybackState | null) => void): void;
    addListener(event: "initialization_error" | "authentication_error" | "account_error" | "playback_error", cb: (data: { message: string }) => void): void;
    removeListener(event: string, cb?: unknown): void;
    togglePlay(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    nextTrack(): Promise<void>;
    previousTrack(): Promise<void>;
    getCurrentState(): Promise<PlaybackState | null>;
    setVolume(volume: number): Promise<void>;
  }

  interface PlayerConstructorOptions {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume?: number;
  }

  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  class Player {
    constructor(options: PlayerConstructorOptions);
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(event: string, cb: (data: unknown) => void): void;
    removeListener(event: string, cb?: unknown): void;
    togglePlay(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    nextTrack(): Promise<void>;
    previousTrack(): Promise<void>;
    getCurrentState(): Promise<PlaybackState | null>;
    setVolume(volume: number): Promise<void>;
  }

  interface PlaybackState {
    paused: boolean;
    position: number;
    duration: number;
    track_window: {
      current_track: {
        name: string;
        artists: { name: string }[];
        album: { name: string; images: { url: string }[] };
        uri: string;
      };
    };
  }
}
