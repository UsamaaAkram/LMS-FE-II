import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import CustomSelect from "../../../core/common/commonSelect";
import { Gender } from "../../../core/common/selectOption/json/selectOption";
import SettingsLinks from "./settingsLinks/settingsLinks";

import type { AppDispatch, RootState } from "../../../core/redux/store";
import {
  clearStudentState,
  getStudentById,
  updateStudentProfile,
} from "../../../core/redux/studentSlice";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name required"),
  lastName: Yup.string().required("Last name required"),
  userName: Yup.string().required("User name required"),
  email: Yup.string().required("Email required").email("Invalid email"),
  phoneNumber: Yup.string().required("Phone number required"),
  address: Yup.string().required("Address required"),
  gender: Yup.object().nullable().required("Gender required"),
});

const StudentSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authUser: any = useSelector<RootState>((state: any) => state.auth.user);
  const student: any = useSelector<RootState>(
    (state: any) => state.auth.user.student
  );
  const dataa: any = useSelector<RootState>((state: any) => state.student);

  const initialValues = {
    firstName: dataa?.profile?.student?.firstName || student?.firstName || "",
    lastName: dataa?.profile?.student?.lastName || student?.lastName || "",
    userName: dataa?.profile?.student?.userName || student?.userName || "",
    email: dataa?.profile?.student?.email || student?.email || "",
    phoneNumber:
      dataa?.profile?.student?.phoneNumber || student?.phoneNumber || "",
    address: dataa?.profile?.student?.address || student?.address || "",
    gender:
      Gender.find(
        (g) => g.value === (dataa?.profile?.student?.gender || student?.gender)
      ) || null,
  };

  useEffect(() => {
    if (!dataa?.profile && authUser?._id) {
      dispatch(getStudentById(authUser._id));
    }
  }, [dataa?.profile, authUser, dispatch]);

  useEffect(() => {
    if (dataa?.success) {
      setTimeout(() => {
        dispatch(clearStudentState());
      }, 2500);
      dispatch(getStudentById(authUser._id));
    }
  }, [dataa?.success, dispatch, authUser]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    if (!authUser?._id) return;
    const payload: any = {
      student: {
        firstName: values.firstName,
        lastName: values.lastName,
        userName: values.userName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        gender: values.gender?.value || "",
      },
    };

    try {
      const resultAction = await dispatch(
        updateStudentProfile({ id: authUser._id, data: payload }) as any
      );
      if (updateStudentProfile.fulfilled.match(resultAction)) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(
          resultAction.payload?.message ||
            "Error updating profile. Please try again."
        );
      }
    } catch (err: any) {
      toast.error(err?.message || "Unexpected error updating profile.");
    }
    setSubmitting(false);
  };

  return (
    <>
      <Breadcrumb title="Settings" />
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <SettingsLinks />
              <div className="card">
                <div className="card-body">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                  >
                    {({ values, setFieldValue, isSubmitting, handleSubmit }) => (
                      <Form onSubmit={handleSubmit}>
                        <div className="edit-profile-info mb-3">
                          <h5 className="mb-1">Personal Details</h5>
                          <p>Edit your personal information</p>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                First Name<span className="text-danger"> *</span>
                              </label>
                              <Field
                                type="text"
                                name="firstName"
                                className="form-control"
                              />
                              <ErrorMessage
                                name="firstName"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Last Name<span className="text-danger"> *</span>
                              </label>
                              <Field
                                type="text"
                                name="lastName"
                                className="form-control"
                              />
                              <ErrorMessage
                                name="lastName"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                User Name<span className="text-danger"> *</span>
                              </label>
                              <Field
                                type="text"
                                name="userName"
                                className="form-control"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Email<span className="text-danger"> *</span>
                              </label>
                              <Field
                                type="email"
                                name="email"
                                className="form-control"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Phone Number
                                <span className="text-danger"> *</span>
                              </label>
                              <Field
                                type="text"
                                name="phoneNumber"
                                className="form-control"
                              />
                              <ErrorMessage
                                name="phoneNumber"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Address<span className="text-danger"> *</span>
                              </label>
                              <Field
                                type="text"
                                name="address"
                                className="form-control"
                              />
                              <ErrorMessage
                                name="address"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Gender<span className="text-danger"> *</span>
                              </label>
                              <CustomSelect
                                options={Gender}
                                className="select"
                                value={values.gender}
                                onChange={(option: any) =>
                                  setFieldValue("gender", option)
                                }
                                placeholder="Select"
                              />
                              <ErrorMessage
                                name="gender"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <button
                              className="btn btn-secondary rounded-pill"
                              type="submit"
                              disabled={dataa?.loading || isSubmitting}
                            >
                              {dataa?.loading ? "Updating..." : "Update Profile"}
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentSettings;
