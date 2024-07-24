const { log } = require("console");
const user = require("../db/models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');

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
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber ? req.body.phoneNumber.toString() : null;
  
  try {
    if (req?.body?.otp && req.body.otp == 555555) {
      console.log("OTP verification started");

      // Attempt to find the user in the database
      const isRegistered = await user.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      });

      const secretKey = crypto.randomBytes(32).toString("hex");
      console.log("JWT Secret:", secretKey);
      const token = jwt.sign(
        { userId: isRegistered ? isRegistered.id : null },
        secretKey,
        { expiresIn: "1h" }
      );
      console.log("JWT Token:", isRegistered);

      if (isRegistered !== null) {
        return res.status(200).json({
          status: true,
          isRegistered: true,
          token: token,
          userData: isRegistered
        });
      } else {
        return res.status(200).json({
          status: true,
          data: phoneNumber,
          isRegistered: false,
          token: token,
        });
      }
    } else if (email) {
      const isRegistered = await user.findOne({
        where: {
          email: email,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      });

      if (isRegistered) {
        return res.status(200).json({
          status: true,
          isRegistered: true,
          userData: isRegistered
        });
      } else {
        const newUser = await user.create({
          name: req.body?.name ?? '', 
          email: email,
          ...(phoneNumber && { phoneNumber: phoneNumber }),
        });

        return res.status(200).json({
          status: true,
          isRegistered: false,
          userData: newUser
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP or email",
      });
    }
  } catch (error) {
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
      // dob: req.body.dob,
    });
    return res.json({
      status: true,
      data: {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        // dob: req.body.dob,
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

// update profile 


const updateProfile = async (req, res, next) => {
  const { name, email, phoneNumber } = req.body;

  try {
    const userRecord = await user.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { phoneNumber: phoneNumber }
        ]
      }
    });

    // Log the result of the query
    console.log("data---", userRecord);

    if (userRecord) {
      const updateData = await userRecord.update({
        email: email,
        phoneNumber: phoneNumber,
        name: name,
      });

      return res.status(200).json({
        status: true,
        message: "Profile Updated Successfully",
        userData: updateData,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return res.status(400).json({
        status: false,
        message: `The ${field} is already in use.`,
      });
    }
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};



module.exports = { signup, login, otpVerify,updateProfile };
