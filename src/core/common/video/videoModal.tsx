import VideoPlayer from "./videoPlayer";

interface Props {
  show: boolean;
  handleClose: () => void;
  videoUrl: string;
  setWatchedSegments?: any;
  watchedSegments?: any;
  duration: number;
  setDuration: any;
}

const VideoModal = ({
  show,
  handleClose,
  videoUrl,
  setWatchedSegments = () => {},
  watchedSegments = [],
  duration,
  setDuration,
}: Props) => {
  if (!show) return null;
  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.6)" }}
      role="dialog"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Preview</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            />
          </div>
          <div className="modal-body">
            {videoUrl ? (
              <VideoPlayer
                videoUrl={videoUrl}
                setWatchedSegments={setWatchedSegments}
                watchedSegments={watchedSegments}
                duration={duration}
                setDuration={setDuration}
                completed={true}
              />
            ) : (
              <p className="text-center text-muted">No preview available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
