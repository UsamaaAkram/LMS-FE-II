import { Select } from "antd";
import dayjs from "dayjs";
import { Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { all_routes } from "../../router/all_routes";
import { useDispatch, useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../core/redux/store"; // <-- path to your store

import {
  getStudentById,
  updateStudentProfile,
} from "../../../core/redux/studentSlice";
import { fetchCourses } from "../../../core/redux/courses";
import moment from "moment";
import { toast } from "react-toastify";
import { genderOptions } from "../../../core/common/common-list";

// Helper

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// --- Types ---
type StudentFormType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: string;
  isDisable: boolean;
  batch: string;
  enrolledBy: string;
  enrolledBranch: string;
  enrollmentDate: string;
  studentType: string;
  shift: string;
  enrolledCourses: string[];
};

const StudentsDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const query = useQuery();
  const studentId = query.get("id");

  // Redux Selectors
  const { profile, loading } = useSelector((state: any) => state.student);
  const { courses } = useSelector((state: any) => state.courses);
  const user = useSelector((state: any) => state.auth.user);

  // Simulate logged in instructor's email
  // Local State
  const [initialDate] = useState(dayjs().format("YYYY-MM-DD"));

  // Load student details (edit) and course list
  useEffect(() => {
    if (studentId) dispatch(getStudentById(studentId));
    dispatch(fetchCourses({}));
  }, [dispatch, studentId]);

  // Form validation
  const validationSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string().email("Invalid email"),
    phoneNumber: Yup.string(),
    address: Yup.string(),
    gender: Yup.string(),
    dob: Yup.string(),
    enrolledCourses: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one course!")
      .required("Select at least one course!"),
  });

  const navigate = useNavigate();

  function submitStudentForm(
    values: StudentFormType,
    { setSubmitting }: FormikHelpers<StudentFormType>
  ) {
    try {
      const payload = {
        student: {
          firstName: values.firstName,
          lastName: values.lastName,
          userName: profile?.student?.userName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address: values.address,
          gender: values.gender,
          isDisable: values.isDisable,
        },
        administrative: {
          batch: values.batch,
          enrolledBy: values.enrolledBy,
          enrolledBranch: values.enrolledBranch,
          enrollmentDate: values.enrollmentDate,
          studentType: values.studentType,
          shift: values.shift,
        },
        enrolledCourses: values.enrolledCourses,
      };

      // Dispatch create/update thunk from Redux
      if (studentId) {
        dispatch(
          updateStudentProfile({
            id: studentId,
            data: payload,
            isAdminUpdate: true,
          })
        )
          .unwrap()
          .then(() => {
            navigate(all_routes.adminStudents);

            toast.success("Student updated successfully!");
          })
          .catch((err: any) => toast.error(err?.message || "Update failed"));
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  // Fill initial values for edit mode
  const initialValues: StudentFormType = {
    firstName: profile?.student?.firstName || "",
    lastName: profile?.student?.lastName || "",
    email: profile?.student?.email || "",
    phoneNumber: profile?.student?.phoneNumber || "",
    address: profile?.student?.address || "",
    gender: profile?.student?.gender || "",
    isDisable: profile?.student?.isDisable || false,
    batch: profile?.administrative?.batch || "",
    enrolledBy: user?.email || "",
    enrolledBranch: profile?.administrative?.enrolledBranch || "",
    enrollmentDate:
      profile?.administrative?.enrollmentDate ||
      moment(profile?.createdAt).format("YYYY-MM-DD HH:mm A") ||
      initialDate,
    studentType: profile?.administrative?.studentType || "",
    shift: profile?.administrative?.shift || "",
    enrolledCourses: profile?.enrolledCourses || [],
  };

  return (
    <>
      <Breadcrumb title="Students Details" />
      <div className="content instructor-detail-content">
        <div className="container">
          <Link
            to={all_routes.adminStudents}
            className="d-flex align-items-center mb-3"
          >
            <i className="isax isax-arrow-left me-1 fw-bold" />
            Back to List
          </Link>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitStudentForm}
          >
            {({ values, setFieldValue, errors, touched, isSubmitting }) => {
              return (
                <Form encType="multipart/form-data">
                  {/* Basic Details */}
                  <div className="card mb-3">
                    <div className="card-header fw-bold fs-16">
                      Student Details
                    </div>
                    <div className="card-body">
                      <div className="row mb-2">
                        <div className="col-md-3 mb-3">
                          <label className="form-label">First Name</label>
                          <Field
                            name="firstName"
                            type="text"
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Last Name</label>
                          <Field
                            name="lastName"
                            type="text"
                            className="form-control"
                          />
                        </div>

                        <div className="col-md-3 mb-3">
                          <label className="form-label">Email</label>
                          <Field
                            name="email"
                            type="email"
                            className="form-control"
                            disabled
                          />
                        </div>

                        <div className="col-md-3 mb-3">
                          <label className="form-label">Gender</label>
                          <Field
                            as="select"
                            name="gender"
                            className="form-select"
                          >
                            <option value="">Select</option>
                            {genderOptions.map((opt) => (
                              <option value={opt} key={opt}>
                                {opt}
                              </option>
                            ))}
                          </Field>
                          {touched.gender && errors.gender && (
                            <div className="text-danger">{errors.gender}</div>
                          )}
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Mobile Number</label>
                          <Field
                            name="phoneNumber"
                            type="text"
                            className="form-control"
                          />
                          {touched.phoneNumber && errors.phoneNumber && (
                            <div className="text-danger">
                              {errors.phoneNumber}
                            </div>
                          )}
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Address</label>
                          <Field
                            name="address"
                            type="text"
                            className="form-control"
                          />
                          {touched.address && errors.address && (
                            <div className="text-danger">{errors.address}</div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                  {/* Enrolled Courses */}
                  <div className="card mb-3">
                    <div className="card-header fw-bold fs-16">
                      Enrolled Courses
                    </div>
                    <div className="card-body">
                      {/* Courses */}
                      <div className="row mb-2">
                        <div className="col-md-12 mb-3">
                          <label className="form-label">
                            Enrolled Courses *
                          </label>
                          <Select
                            mode="multiple"
                            className="course-select"
                            style={{ width: "100%" }}
                            value={values.enrolledCourses}
                            placeholder="Select courses"
                            onChange={(list: string[]) =>
                              setFieldValue("enrolledCourses", list)
                            }
                            optionLabelProp="label"
                            filterOption={(input, option) =>
                              ((option?.label as string) || "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            {courses
                              ?.filter(
                                (course: any) => course.status === "published"
                              )
                              .map(
                                (course: {
                                  _id: string;
                                  courseTitle: string;
                                  courseThumbnailUrl?: string;
                                }) => (
                                  <Select.Option
                                    value={course._id}
                                    key={course._id}
                                    label={course.courseTitle}
                                  >
                                    <span>{course.courseTitle}</span>
                                  </Select.Option>
                                )
                              )}
                          </Select>
                          {touched.enrolledCourses &&
                            errors.enrolledCourses && (
                              <div className="text-danger">
                                {errors.enrolledCourses as string}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-secondary px-5 py-2"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default StudentsDetails;
