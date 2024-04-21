const { log } = require("console");
const user = require("../db/models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const login = async (req, res, next) => {
  console.log(" req ", req);
  try {
    return res.json({
      status: true,
      data: req.body.phoneNumber,
    });
  } catch (error) {}
};

const otpVerify = async (req, res, next) => {
  try {
    if (req.body.otp == 555555) {
      console.log("OTP verification started");

      // Attempt to find the user in the database
      const isRegistered = await user.findOne({
        where: {
          phoneNumber: req.body.phoneNumber.toString(),
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"], // Corrected the attribute names
        },
      });

      const secretKey = crypto.randomBytes(32).toString("hex");
      console.log("JWT Secret:", secretKey); // Add this line to check the value of JWT_SECRET
      const token = jwt.sign(
        { userId: isRegistered ? isRegistered.id : null }, // Use user ID if found, otherwise null
        secretKey,
        { expiresIn: "1h" }
      );
      console.log("JWT Token:", isRegistered);
      // Check if user is registered
      if (isRegistered !== null) {
        return res.status(200).json({
          status: true,
          isRegistered: true,
          token: token,
          userData: isRegistered,
        });
      } else {
        return res.status(200).json({
          status: true,
          data: req.body.phoneNumber,
          isRegistered: false,
          token: token,
        });
      }
    } else {
      return res.status(200).json({
        status: false,
        message: "wrong password",
      });
    }
  } catch (error) {
    // Handle any errors that occur during OTP verification
    console.error("Error during OTP verification:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const signup = async (req, res, next) => {
  console.log(" sign up ", req.body);

  const existingUser = await user.findOne({
    where: { phoneNumber: req.body.phoneNumber },
  });
  console.log(" after sign up  ", existingUser);
  if (existingUser) {
    return res.status(200).json({
      status: false,
      message: "User with this phone number already exists",
    });
  }

  try {
    const newUser = await user.create({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      dob: req.body.dob,
    });
    return res.json({
      status: true,
      data: {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        dob: req.body.dob,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      status: false,
      message: "Failed to create the new user",
    });
  }
};

module.exports = { signup, login, otpVerify };
