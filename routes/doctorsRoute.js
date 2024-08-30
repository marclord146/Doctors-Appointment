const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");

router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.body.userId });
      res.status(200).send(
        {
          message: "Doctor found",
          success: true,
          data: doctor,
        }
      );
      
    } catch (error) {
      console.error("Error getting doctor info:", error);
      return res
        .status(500)
        .json({ message: "Error getting user info", success: false, error });
    }
  });

  router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
    try {
      const doctor = await Doctor.findOneAndUpdate({userId: req.body.userId},req.body);
      res.status(200).send(
        {
          message: "Doctor info updated successfully",
          success: true,
          data: doctor,
        }
      );
      
    } catch (error) {
      console.error("Error updating doctor info:", error);
      return res
        .status(500)
        .json({ message: "Error getting user info", success: false, error });
    }
  });

  router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ _id: req.body.doctorId });
      res.status(200).send(
        {
          message: "Doctor found",
          success: true,
          data: doctor,
        }
      );
      
    } catch (error) {
      console.error("Error getting doctor info:", error);
      return res
        .status(500)
        .json({ message: "Error getting user info", success: false, error });
    }
  });


  router.get("/get-appointments-by-doctor-id", authMiddleware, async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.body.userId });
      const appointments = await Appointment.find({doctorId: doctor._id});
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


  router.post("/change-appointment-status", authMiddleware, async (req, res) => {
    try {
      const { appointmentId, status} = req.body;
      const appointment = await Appointment.findByIdAndUpdate(appointmentId,
        {  status }
      );
      
      const user = await User.findOne({ _id: appointment.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "appointment-status-changed",
        message: `Your appointment has been ${status}`,
        onClickPath: "/appointments",
      });
      await user.save();
      
       
      res.status(200).send({
        message: "Appointment status changed successfully",
        success: true
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error getting appointment status changed",
        success: false,
        error,
      });
    }
  });

  module.exports = router;