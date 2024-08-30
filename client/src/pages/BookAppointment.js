/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import toast from "react-hot-toast";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false); // Initialize state correctly
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    if (!date || !time) {
      toast.error("Please select both date and time");
      return;
    }
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      dispatch(hideLoading());
    }
  };

  const checkAvailablity = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData(); // Fetch doctor data on component mount
  }, []);
 
  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <hr />
          <Row gutter={28} className="mt-5" align="center">
            <Col span={8} sm={24} xs={24} lg={8}>
              <img
                src="https://media.istockphoto.com/id/1218429063/vector/book-now-blue-3d-button-with-hand-pointer-clicking-white-background-vector.jpg?s=612x612&w=0&k=20&c=CO0g9JdSzRSL0hBJilmBUMYbPn0VFj4U5ckyx77ZNnQ="
                alt=""
                width="250"
                height="250"
              />
            </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Timings: </b>
                {doctor.timings[0]} - {doctor.timings[1]}
              </h1>
              <p>
                <b>Address: </b>
                {doctor.address}
              </p>
              <p>
                <b>Phone Number: </b>
                {doctor.phoneNumber}
              </p>
              <p>
                <b>Consultation Fee: </b>
                {doctor.feePerConsultation}
              </p>

              <div className="d-flex flex-column pt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setDate(moment(value).format("DD-MM-YYYY"));
                  }}
                />

                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(moment(value).format("HH:mm")); // Format time to HH:mm
                  }}
                />

                <Button
                  className="primary-button mt-3 full-width-button"
                  onClick={checkAvailablity}
                >
                  Check Availability
                </Button>

                {isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-button"
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
