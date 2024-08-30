/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Badge } from "antd";
import "../layout.css";
function Layout({ children }) {
  const [collasped, setCollasped] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Apply Doctor",
      path: "/apply-doctor",
      icon: "ri-hospital-line",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "ri-user-line",
    },
  ];
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Profile",
      path: user ? `/doctor/profile/${user._id}` : "/",
      icon: "ri-user-line",
    },
  ];
  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Users",
      path: "/users",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/admin/doctorlist",
      icon: "ri-user-star-line",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "ri-user-line",
    },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";
  return (
    <div className="main">
      <div className="d-flex layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="logo">STH</h1>
            <h1 className="role">{role}</h1>
            <div className="menu">
              {menuToBeRendered.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <div
                    className={`d-flex menu-item ${
                      isActive && "active-menu-item"
                    }`}
                  >
                    <i className={menu.icon}></i>
                    {!collasped && <Link to={menu.path}>{menu.name}</Link>}
                  </div>
                );
              })}
              <div
                className={`d-flex menu-item`}
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                <i className="ri-logout-circle-line"></i>
                {!collasped && <Link to="/login">Logout</Link>}
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="header">
            {collasped ? (
              <i
                className="ri-menu-line header-action-icon"
                onClick={() => setCollasped(false)}
              ></i>
            ) : (
              <i
                className="ri-close-fill header-action-icon"
                onClick={() => setCollasped(true)}
              ></i>
            )}

            <div className="d-flex align-items-center px-4">
              <Badge count={user?.unseenNotifications.length} onClick={()=>navigate("/notifications")}>
                <i className="ri-notification-line header-action-icon mr-2"></i>
              </Badge>

              <Link className="anchor mx-2" to="/profile">
                {user?.name}
              </Link>
            </div>
          </div>

          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
