const user = require("../db/models/user");

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
    const isRegistered = await user.findOne({
      where: { phoneNumber: req.body.phoneNumber },
    });
    console.log(" isRegistered ", req.body.otp);
    if (req.body.otp == 555555) {
      if (isRegistered) {
        return res.status(200).json({
          status: true,
          data: req.body.phoneNumber,
          isRegistered: true,
        });
      } else {
        return res.status(200).json({
          status: true,
          data: req.body.phoneNumber,
          isRegistered: false,
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "OTP Verification Failed",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "OTP Verification Failed",
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
    return res.status(400).json({
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
      data: newUser,
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
