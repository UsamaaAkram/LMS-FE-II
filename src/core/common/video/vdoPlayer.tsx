import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Renders a VdoCipher DRM player. Fetches a short-lived OTP from our backend
// (which enforces enrollment + stamps the student's email watermark).
const VdoPlayer = ({ vdoId, courseId }: { vdoId: string; courseId?: string }) => {
  const [embed, setEmbed] = useState<{ otp: string; playbackInfo: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setEmbed(null);
    setError(null);
    axios
      .post(`${API_URL}/api/videos/${vdoId}/otp`, { courseId })
      .then((res) => {
        if (active) setEmbed(res.data);
      })
      .catch((e) => {
        if (active)
          setError(e.response?.data?.error || "Unable to load protected video");
      });
    return () => {
      active = false;
    };
  }, [vdoId, courseId]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!embed)
    return (
      <div className="text-center py-5">
        <span className="spinner-border" />
      </div>
    );

  return (
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <iframe
        title="course-video"
        src={`https://player.vdocipher.com/v2/?otp=${embed.otp}&playbackInfo=${embed.playbackInfo}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
          borderRadius: 8,
        }}
        allow="encrypted-media"
        allowFullScreen
      />
    </div>
  );
};

export default VdoPlayer;
