import { useCallback, useEffect, useRef, useState } from "react";

const VideoPlayer = ({
  videoUrl,
  setWatchedSegments,
  watchedSegments,
  duration,
  setDuration,
}: {
  videoUrl: string;
  setWatchedSegments: React.Dispatch<
    React.SetStateAction<{ start: number; end: number }[]>
  >;
  watchedSegments: { start: number; end: number }[];
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  completed?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const maxAllowed = useRef(0);

  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    maxAllowed.current = 0;
  }, [videoUrl]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (muted) {
      const restoreVol = prevVolume > 0 ? prevVolume : 0.5;
      setVolume(restoreVol);
      setMuted(false);
      if (videoRef.current) {
        videoRef.current.volume = restoreVol;
        videoRef.current.muted = false;
      }
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setMuted(true);
      if (videoRef.current) {
        videoRef.current.volume = 0;
        videoRef.current.muted = true;
      }
    }
  };

  const getVolumeIcon = () => {
    if (muted || volume === 0) return "fa-volume-xmark";
    if (volume < 0.5) return "fa-volume-low";
    return "fa-volume-high";
  };

  const enterFullscreen = useCallback(async () => {
    try {
      if (containerRef.current?.requestFullscreen)
        await containerRef.current.requestFullscreen();
    } catch (err) {
      console.warn("Fullscreen not supported:", err);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch (err) {
      console.warn("Exit fullscreen failed:", err);
    }
  }, []);

  const toggleFullscreen = () => {
    if (isFullscreen) exitFullscreen();
    else enterFullscreen();
  };

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play();
  };
  const handlePause = () => {
    setPlaying(false);
    videoRef.current?.pause();
  };

  const getLastWatched = () =>
    watchedSegments.length ? Math.max(...watchedSegments.map((s) => s.end)) : 0;

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current?.duration || 0);
    const lastWatched = getLastWatched();
    if (videoRef.current && lastWatched > 0) {
      videoRef.current.currentTime = lastWatched;
      setCurrent(lastWatched);
      maxAllowed.current = lastWatched;
    } else {
      setCurrent(0);
      maxAllowed.current = 0;
    }
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
    }
  };

  const handleTimeUpdate = () => {
    const now = videoRef.current?.currentTime || 0;
    setCurrent(now);
    setWatchedSegments((segments) => {
      if (!segments.length || now > segments[segments.length - 1].end + 1) {
        return [...segments, { start: now, end: now }];
      }
      return [
        ...segments.slice(0, -1),
        { start: segments[segments.length - 1].start, end: now },
      ];
    });
    if (now > maxAllowed.current) maxAllowed.current = now;
  };

  const handleCustomSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * duration;
    videoRef.current!.currentTime = seekTime;
    setCurrent(seekTime);
  };

  return (
    <div
      ref={containerRef}
      style={{
        background: isFullscreen ? "#000" : "transparent",
        display: "flex",
        flexDirection: "column",
        ...(isFullscreen
          ? { height: "100vh", width: "100vw", justifyContent: "center" }
          : {}),
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: isFullscreen ? 0 : 8,
          overflow: "hidden",
          background: "#000",
          flex: isFullscreen ? 1 : "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          style={{
            display: "block",
            width: "100%",
            height: isFullscreen ? "100%" : "70vh",
            objectFit: "contain",
          }}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPause={handlePause}
          onPlay={handlePlay}
          onClick={!playing ? handlePlay : handlePause}
        />
        {!playing && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              zIndex: 10,
              background: "rgba(0,0,0,0.35)",
              borderRadius: "50%",
              padding: 18,
              color: "white",
            }}
            onClick={handlePlay}
          >
            <i className="fa-solid fa-play fs-28" />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#eee",
            cursor: "pointer",
          }}
          onClick={handleCustomSeek}
        >
          <span
            style={{
              position: "absolute",
              left: `${duration ? (current / duration) * 100 : 0}%`,
              width: 2,
              height: "100%",
              background: "#1976d2",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={playing ? handlePause : handlePlay}
          className="btn btn-secondary px-3 gap-1 d-flex align-items-center"
        >
          {playing ? (
            <i className="fa-solid fa-pause fs-10" />
          ) : (
            <i className="fa-solid fa-play fs-10" />
          )}
          {playing ? "Pause" : "Play"}
        </button>
        <span>
          {formatTime(current)} / {formatTime(duration)}
        </span>
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={toggleMute}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36, padding: 0 }}
          >
            <i className={`fa-solid ${getVolumeIcon()}`} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={toggleFullscreen}
          className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
        >
          <i className={`fa-solid ${isFullscreen ? "fa-compress" : "fa-expand"}`} />
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>
    </div>
  );
};

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default VideoPlayer;
