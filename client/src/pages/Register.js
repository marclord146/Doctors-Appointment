import  React from 'react';
import {Form, Input, Button} from 'antd';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import {useSelector, useDispatch} from "react-redux";
import { showLoading, hideLoading } from '../redux/alertsSlice';

function Register(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async(values) => {
        try {
            dispatch(showLoading());
            const response = await axios.post("api/user/register", values);
            dispatch(hideLoading());
            if(response.data.success){
                toast.success(response.data.message);
                toast.success("Redirecting to login page");
                navigate("/login");

            }else{
                toast.error(response.data.message);

            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong")
            
        }
    }
    return(
        <div className='authentication'>
          <div className='authentication-form card p-2'>
            <h1 className='card-title'>Nice to meet you</h1>
            <Form layout='vertical' onFinish={onFinish}> 
                <Form.Item label= 'Name' name='name'>
                    <Input placeholder='Name'/>
                </Form.Item>
                <Form.Item label= 'Email' name='email'>
                    <Input placeholder='Name'/>
                </Form.Item>
                <Form.Item label= 'Password' name='password'>
                    <Input placeholder='Password' type="password"/>
                </Form.Item>
                <Button className="primary-button my-3 custom-width" htmlType="submit">Register</Button>

                <Link to="/login" className="anchor">Already Registered, Log In</Link>
                
            </Form>

          </div>

        </div>

    )
}

export default Register