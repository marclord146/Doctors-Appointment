/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import toast from "react-hot-toast";
import moment from "moment";


function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-appointments-by-user-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
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
          title: "Doctor",
          dataIndex: "name",
          render: (text, record) => <div className="normal-text">{record.doctorInfo.firstName} {record.doctorInfo.lastName}</div>
        },
        {
          title: "Phone",
          dataIndex: "phoneNumber",
          render: (text, record) => <div className="normal-text">{record.doctorInfo.phoneNumber}</div>
        },
        {
          title: "Date and time",
          dataIndex: "createdAt",
          render: (text, record) => <span>{moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}</span>
        },
        {
          title: "Status",
          dataIndex: "status",
        },
        
      ];
  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  )
}

export default Appointments