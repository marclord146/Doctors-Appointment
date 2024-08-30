/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import toast from "react-hot-toast";


function Doctorslist() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  const changeDoctorStatus = async (record,status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/admin/change-doctors-status", {doctorId : record._id, userId : record.userId, status: status},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getDoctorsData();
        
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error changing doctor status");
      console.log(error);
    }
  };
  useEffect(() => {
    getDoctorsData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => <div className="normal-text">{record.firstName} {record.lastName}</div>
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
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
          {record.status === "pending" && <h1 className="anchor" onClick={()=>changeDoctorStatus(record,'Approved')}>Approve</h1>}
          {record.status === "Approved" && <h1 className="anchor" onClick={()=>changeDoctorStatus(record,'Blocked')}>Block</h1>}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-header">Doctors List</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
    
  )
}

export default Doctorslist