const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).send({
      message: "Doctors found",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting doctors",
      success: false,
      error,
    });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({
      message: "Users found",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting users",
      success: false,
      error,
    });
  }
});

router.post("/change-doctors-status", authMiddleware, async (req, res) => {
  try {
    const { doctorId, status} = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId,
      {  status }
    );
    
    const user = await User.findOne({ _id: doctor.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request-changed",
      message: `Your doctor account has been ${status}`,
      onClickPath: "/notifications",
    });
    user.isDoctor = status === "Approved" ? true : false;
    await user.save();
    
     
    res.status(200).send({
      message: "Doctor status changed",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting doctor status changed",
      success: false,
      error,
    });
  }
});



module.exports = router;
