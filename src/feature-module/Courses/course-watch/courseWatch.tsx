import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { fetchCourseById } from "../../../core/redux/courses";
import type { AppDispatch } from "../../../core/redux/store";
import VideoPlayer from "../../../core/common/video/videoPlayer";
import VdoPlayer from "../../../core/common/video/vdoPlayer";
import { all_routes } from "../../router/all_routes";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const CourseWatch = () => {
  const query = useQuery();
  const id: any = query.get("id");
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: any) => state.auth.user);

  const { currentCourse, loading, error } = useSelector(
    (state: any) => state.courses
  );

  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [vdoId, setVdoId] = useState("");
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [watchedSegments, setWatchedSegments] = useState<any[]>([]);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (id) dispatch(fetchCourseById(id) as any);
  }, [id, dispatch]);

  const backLink =
    user?.role === "admin" ? all_routes.adminCourses : all_routes.studentCourses;

  if (loading)
    return (
      <div className="my-5 text-center">
        <span className="spinner-border"></span>
      </div>
    );
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!currentCourse)
    return <div className="text-center my-5">No course info found.</div>;

  return (
    <>
      <Breadcrumb title="Course watch" />
      <div className="content pt-0">
        <div className="container-fluid">
          <div className="course-watch-section">
            <div className="row">
              {/* Left: curriculum */}
              <div
                className="col-lg-4 border-end"
                style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}
              >
                <div className="progress-overview-section">
                  <div className="mb-4">
                    <Link to={backLink} className="back-to-course">
                      <i className="isax isax-arrow-left me-1" />
                      Back to Courses
                    </Link>
                  </div>
                  <h3>{currentCourse.courseTitle}</h3>
                  <div className="mb-3 text-muted">
                    {currentCourse.courseCategory} | {currentCourse.courseLevel}
                  </div>

                  {!showVideo && currentCourse.courseThumbnailUrl && (
                    <img
                      alt="Course"
                      src={currentCourse.courseThumbnailUrl}
                      className="img-fluid rounded mb-3"
                    />
                  )}

                  <div
                    className="accordions-items-seperate"
                    id="accordionSpacingExample"
                  >
                    {currentCourse.curriculum?.map((topic: any, i: number) => (
                      <div className="accordion-item" key={topic._id || i}>
                        <div className="accordion-header" id={`heading${i}`}>
                          <button
                            className={
                              "accordion-button" + (i !== 0 ? " collapsed" : "")
                            }
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${i}`}
                          >
                            <div>
                              <span className="d-block mb-1">Section {i + 1}</span>
                              <h6 className="mb-0">{topic.topic}</h6>
                            </div>
                          </button>
                        </div>
                        <div
                          id={`collapse${i}`}
                          className={
                            "accordion-collapse collapse" + (i === 0 ? " show" : "")
                          }
                          data-bs-parent="#accordionSpacingExample"
                        >
                          <div className="accordion-body">
                            {topic.lessons?.map((lessonItem: any) => {
                              const isActive = activeLesson === lessonItem._id;
                              return (
                                <div
                                  className={`d-flex align-items-center justify-content-between mb-3 p-2 rounded ${
                                    isActive
                                      ? "bg-primary bg-opacity-10 border border-primary"
                                      : ""
                                  }`}
                                  style={{ cursor: "pointer" }}
                                  key={lessonItem._id}
                                  onClick={() => {
                                    setWatchedSegments([]);
                                    setDuration(0);
                                    setVideoUrl(lessonItem?.videoUrl || "");
                                    setVdoId(lessonItem?.vdoId || "");
                                    setActiveLesson(lessonItem._id);
                                    setShowVideo(true);
                                  }}
                                >
                                  <div className="d-flex align-items-center">
                                    <span className="d-flex">
                                      <i
                                        className={`isax ${
                                          isActive
                                            ? "isax-pause-circle5 text-primary"
                                            : "isax-play-circle5 text-success"
                                        } fs-24 me-1`}
                                      />
                                    </span>
                                    <p
                                      className={`accordian-content mb-0 ${
                                        isActive ? "fw-semibold text-primary" : ""
                                      }`}
                                    >
                                      {lessonItem.name}
                                    </p>
                                  </div>
                                  {isActive && (
                                    <span className="badge bg-primary">Playing</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: player + tabs */}
              <div className="col-lg-8">
                <div className="course-watch-content">
                  {showVideo ? (
                    <div className="mb-4">
                      {vdoId ? (
                        <VdoPlayer key={activeLesson || vdoId} vdoId={vdoId} courseId={id} />
                      ) : (
                        <VideoPlayer
                          key={activeLesson || videoUrl}
                          videoUrl={videoUrl}
                          setWatchedSegments={setWatchedSegments}
                          watchedSegments={watchedSegments}
                          duration={duration}
                          setDuration={setDuration}
                          completed={false}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="position-relative video-btn mb-4">
                      {currentCourse.courseThumbnailUrl && (
                        <img
                          className="img-fluid rounded"
                          src={currentCourse.courseThumbnailUrl}
                          alt="Course"
                        />
                      )}
                      <p className="text-muted text-center mt-2">
                        Select a lesson from the left to start watching
                      </p>
                    </div>
                  )}

                  <ul
                    className="nav-tabs mb-4 nav-justified border-0 nav-style-1 d-flex"
                    role="tablist"
                  >
                    <li className="nav-item active">
                      <Link
                        className="btn nav-link active"
                        data-bs-toggle="tab"
                        to="#overview"
                      >
                        Overview
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="btn nav-link" data-bs-toggle="tab" to="#notes">
                        Notes
                      </Link>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane active show" id="overview" role="tabpanel">
                      <h6 className="fs-18 fw-semibold mb-2">Description</h6>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentCourse.courseDescription || "",
                        }}
                      />
                    </div>
                    <div className="tab-pane" id="notes" role="tabpanel">
                      <h6 className="fs-18 fw-semibold mb-1">Notes</h6>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentCourse.notes || "",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseWatch;
