import moment from "moment";
import React, { useEffect, useState } from "react";
import { Switch } from "antd";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import Table from "../../../core/common/dataTable/index";
import ImageGlobal from "../../../core/common/ImageGlobal/ImageGlobal";
import {
  getStudentSummary,
  signupStudent,
  setStudentStatus,
} from "../../../core/redux/studentSlice";
import { all_routes } from "../../router/all_routes";
import AddStudentModal from "./AddStudentModal";

const StudentList: React.FC = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({});
  const { students, loading } = useSelector((state: any) => state.student);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCreateStudent = async (values: any) => {
    const res = await dispatch(signupStudent({...values, role:'student'}) as any);
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Student created successfully!");
      setShowAddModal(false);
      dispatch(getStudentSummary({}) as any);
      // Optionally refresh list here
    } else {
      toast.error(res.payload || "Student creation failed.");
    }
  };

  const handleToggleStatus = async (record: any) => {
    const res = await dispatch(
      setStudentStatus({ id: record._id, isDisable: !record.isDisable }) as any
    );
    if (res.meta.requestStatus === "fulfilled") {
      toast.success(record.isDisable ? "Student enabled" : "Student disabled");
    } else {
      toast.error(res.payload || "Status update failed");
    }
  };

  useEffect(() => {
    // fetch unfiltered list (or use summary endpoint without filters)
    dispatch(getStudentSummary({}) as any);
  }, [dispatch]);

  // Call summary API whenever filters change
  useEffect(() => {
    dispatch(getStudentSummary(filters) as any);
  }, [dispatch, filters]);

  const columns = [
    {
      title: "Name",
      dataIndex: "",
      render: (_: string, record: any) => (
        <div className="d-flex align-items-center">
          <ImageGlobal
            src={record?.photo}
            className="avatar avatar-md avatar-rounded flex-shrink-0 me-2"
          />
          <Link
            to={`${all_routes.adminStudentDetails}?id=${record._id}`}
            className="text-secondary"
          >
            <p className="fs-14 mb-0 uppercase text-secondary">
              {record?.firstName && record?.lastName
                ? `${record?.firstName} ${record?.lastName}`
                : record?.userName}
            </p>
          </Link>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (_: string, record: any) => (
        <p className="fs-14 mb-0">{record?.email || "N/A"}</p>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      render: (_: string, record: any) => (
        <p className="fs-14 mb-0">{record?.phoneNumber || "N/A"}</p>
      ),
    },
    {
      title: "Enrollment Date",
      dataIndex: "enrollmentDate",
      render: (text: string) => {
        return moment(text).format("DD/MM/YYYY");
      },
    },
    {
      title: "Courses",
      dataIndex: "enrolledCourses",
      render: (_: string, record: any) => record?.coursesLength ?? 0,
    },
    {
      title: "Status",
      render: (_: any, record: any) => (
        <span
          className={
            record.isDisable ? "text-danger fw-medium" : "text-success fw-medium"
          }
        >
          {record.isDisable ? "Inactive" : "Active"}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center gap-3">
          <Switch
            checked={!record.isDisable}
            onChange={() => handleToggleStatus(record)}
            title={record.isDisable ? "Enable" : "Disable"}
          />
          <Link
            to={`${all_routes.adminStudentDetails}?id=${record._id}`}
            className="btn btn-sm btn-outline-secondary"
            title="View / Assign courses"
          >
            <i className="isax isax-eye" />
          </Link>
        </div>
      ),
    },
  ];
  return (
    <>
      <Breadcrumb title="Students List" />
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Student
                </Button>
                <div
                  className="input-icon mb-0"
                  style={{ maxWidth: 320, width: "100%" }}
                >
                  <span className="input-icon-addon">
                    <i className="isax isax-search-normal-14" />
                  </span>
                  <input
                    type="search"
                    className="form-control form-control-md"
                    placeholder="Search by email"
                    onChange={(e: any) => {
                      setFilters((prev: any) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <AddStudentModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleCreateStudent}
                loading={loading}
              />
              {loading ? (
                <div className="py-5 text-center">
                  <span className="spinner-border spinner-border-sm" />
                </div>
              ) : (
                <Table dataSource={students} columns={columns} Search={false} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentList;
