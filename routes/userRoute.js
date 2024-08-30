const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).send({ message: "User exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();
    res
      .status(200)
      .send({ message: "User successfully created!", success: true });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // Send the token back to the client along with other data
    res.status(200).send({ message: "Login successful", success: true, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
  }
});

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    } else {
      return res
        .status(200)
        .json({
          message: "User found",
          success: true,
          data: user
        });
    }
  } catch (error) {
    console.error("Error getting user info:", error);
    return res
      .status(500)
      .json({ message: "Error getting user info", success: false, error });
  }
});

router.post("/apply-doctor-account", authMiddleware, async (req, res) =>{
  try {
    const newdoctor = new Doctor({...req.body, status: 'pending'});
    await newdoctor.save();
    const adminUser = await User.findOne({isAdmin: true});
    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: 'new-doctor-request',
      message: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newdoctor.id,
        name: newdoctor.firstName
      },
      onClickPath: "/admin/doctorlist"
    })
    await User.findByIdAndUpdate(adminUser._id, {unseenNotifications});
    res.status(200).send({
      success: true,
      message: "Successfully applied for a doctor account",
      
    });

  } catch (error) {
    console.error("Error applying doctor-account:", error);
    res
      .status(500)
      .send({ message: "Error applying doctor account", success: false, error });
  }

});

router.post("/mark-all-notifications-as-seen", authMiddleware, async (req, res) =>{
  try {
    const user =await User.findOne({_id: req.body.userId});
    const unseenNotifications = user.unseenNotifications;
    const seenNotifications = user.seenNotifications;
    seenNotifications.push(...unseenNotifications);
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Successfully marked all notifications as seen",
      data: updatedUser
      
    });
    

  } catch (error) {
    console.error("Error marking notifications as seen:", error);
    res
      .status(500)
      .send({ message: "Error marking notifications as seen", success: false, error });
  }

});

router.post("/delete-all-notifications", authMiddleware, async (req, res) =>{
  try {
    const user =await User.findOne({_id: req.body.userId});
    user.seenNotifications=[];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications are deleted",
      data: updatedUser
      
    });
    

  } catch (error) {
    console.error("Error deleting notifications:", error);
    res
      .status(500)
      .send({ message: "Error deleting notifications", success: false, error });
  }

});

router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({status: "Approved"});
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


router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status= "pending";
     // Store date and time in their respective formats
     req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
     req.body.time = moment(req.body.time, 'HH:mm').toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    const user = await User.findOne({_id: req.body.doctorInfo.userId});
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `${req.body.userInfo.name}  has booked an appointment`,
      onClickPath: "/doctor/appointments"
    });
    console.log(req.body.time);
    await user.save();
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.post("/check-booking-availability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
    const fromTime = moment(req.body.time,'HH:mm').subtract(1,"hours").toISOString();
    const toTime = moment(req.body.time,'HH:mm').add(1,"hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorInfo: doctorId,
      date,
      time: {$gte: fromTime, $lte: toTime},
      
    });
    if(appointments.length > 0){
      return res.status(200).send({
        message: "Appointment not available",
        success: false,
      });
    }else{
      return res.status(200).send({
        message: "Appointment available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({userId: req.body.userId});
    res.status(200).send({
      message: "Appointments found",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting appointments",
      success: false,
      error,
    });
  }
});
module.exports = router;
