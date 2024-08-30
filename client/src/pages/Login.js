import React from "react";
import { Form, Input, Button } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("api/user/login", values);
      dispatch(hideLoading());

      const { data } = response;
      if (data.success) {
        const { token } = data; // Assuming the token is sent back in the response
        localStorage.setItem("token", token); // Store the token in local storage
        toast.success(response.data.message);
        console.log(token);
        toast.success("Redirecting to home page");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="authentication">
      <div className="authentication-form card p-2">
        <h1 className="card-title">Login</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <Button className="primary-button my-3 custom-width"  htmlType="submit">
            Login
          </Button>

          <Link to="/register" className="anchor">
            Dont have an account, Sign Up
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Login;
