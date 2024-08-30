/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import toast from "react-hot-toast";
import moment from "moment";


function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/doctor/get-appointments-by-doctor-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/change-appointment-status",
        { appointmentId: record.id, status: status},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentsData();
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error changing doctor status");
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointmentsData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => (
        <div className="normal-text">{record.userInfo.name} </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => (
        <div className="normal-text">{record.doctorInfo.phoneNumber}</div>
      ),
    },
    {
      title: "Date and time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}{" "}
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex">
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "Approved")}
              >
                Approve
              </h1>
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "Reject")}
              >
                Reject
              </h1>
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
}

export default DoctorAppointments;
