import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Col, Row } from 'antd';
import Doctor from '../components/Doctor';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from "../redux/alertsSlice";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const getData=async()=>{
    try {
      dispatch(showLoading());
      const token = localStorage.getItem("token");
      console.log("Authorization token:", token);
      const response = await axios.get('/api/user/get-all-approved-doctors',{
        headers : {
          Authorization: "Bearer " + token,
        },

      });
      dispatch(hideLoading());
      if(response.data.success){
        setDoctors(response.data.data);
        console.log(response.data.data);
      }
      console.log(response.data);
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      
    }

  }
  useEffect(()=>{

    getData();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
  return (
  <Layout>
    <Row gutter={20}>
      {doctors.map((doctor)=>(
        <Col span={8} xs={24} sm={24} lg={8}>
          <Doctor doctor={doctor}/>
        </Col>
      ))}
    </Row>
  </Layout>
  );
}

export default Home