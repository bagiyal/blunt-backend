const { log } = require("console");
const user = require("../db/models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const { default: axios } = require("axios");

const login = async (req, res, next) => {
  console.log(" req ", req);
  try {
    return res.json({
      status: true,
      data: req.body.phoneNumber,
    });
  } catch (error) {}
};


const SendOtp = async (req,res) => {
  const { recipient } = req.body;
  const USER = 'bluntm.trans';
  const PASSWORD = 'jOoF4';
  const DLT_PRINCIPAL_ENTITY_ID = '1701172188936400687';
  const DLT_CONTENT_ID = '1707172199431093782';
  const FROM = 'bluntm';
  const otp = generateOTP();
  console.log("otp value ---",otp);
  const message = `Welcome to BLUNT MEDIA PVT. LTD. Your OTP for APP Login is ${otp}`;
  if (!recipient || !message) {
      return res.status(400).json({ error: 'Recipient and message are required.' });
  }
   // Store OTP
   storeOtp(recipient, otp);

  const payload = {
      credentials: {
          user: USER,
          password: PASSWORD
      },
      options: {
          dltPrincipalEntityId: DLT_PRINCIPAL_ENTITY_ID
      },
      from: FROM,
      shortMessages: [
          {
              message: message,
              recipient: recipient,
              corelationId: 1,
              dltContentId: DLT_CONTENT_ID
          }
      ],
      unicode: 'false'
  };

  try {
      const response = await axios.post('https://pgapi.vispl.in/fe/api/v1/one2One', payload);
      res.json({ status: 'success', data: response.data });
  } catch (error) {
      console.error('Error sending OTP:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to send OTP' });
  }
}

const generateOTP = () => {
return Math.floor(100000 + Math.random() * 900000).toString();
};

const otpVerify = async (req, res, next) => {
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber ? req.body.phoneNumber.toString() : null;
  
  try {

     // Retrieve the stored OTP
     const storedOtp = getOtp(phoneNumber);

    if (req?.body?.otp && req.body.otp == storedOtp) {
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


const otpVerifyAndSignup = async (req, res, next) => {
  const phoneNumber = req.body.phoneNumber ? req.body.phoneNumber.toString() : null;
  try {
    if (!phoneNumber) {
      return res.status(400).json({
        status: false,
        message: "Phone number is required",
      });
    }

    // OTP Verification Process
    const storedOtp = getOtp(phoneNumber);
    console.log("if  ",(req?.body?.otp && req.body.otp == storedOtp),req?.body?.otp,storedOtp);
    if (req?.body?.otp && req.body.otp == storedOtp) {
      console.log("OTP verification started");

      // Check if user already exists
      const existingUser = await user.findOne({
        where: { phoneNumber: phoneNumber },
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      });

      if (existingUser) {
        return res.status(200).json({
          status: true,
          isRegistered: true,
          userData: existingUser
        });
      }

      // If user doesn't exist, create a new user
      const newUser = await user.create({
        phoneNumber: phoneNumber,
        name: req.body.name || '', // Default to empty string if name is missing
        email: req.body.email || '', // Default to empty string if email is missing
      });

      const secretKey = crypto.randomBytes(32).toString("hex");
      console.log("JWT Secret:", secretKey);

      const token = jwt.sign({ userId: newUser.id }, secretKey, { expiresIn: "1h" });

      return res.status(200).json({
        status: true,
        message: "User created successfully",
        token,
        userData: newUser,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    console.error("Error during OTP verification and signup:", error);
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

// function 

const otpStore = {}; // In-memory storage for OTPs (keyed by phone number)

// Function to store OTP temporarily
const storeOtp = (phoneNumber, otp) => {
    otpStore[phoneNumber] = {
        otp,
        timestamp: Date.now()
    };
    setTimeout(() => {
        delete otpStore[phoneNumber];
    }, 5 * 60 * 1000); // OTP expires in 5 minutes
    console.log("otp store ---",otpStore);
};

// Function to get OTP
const getOtp = (phoneNumber) => otpStore[phoneNumber]?.otp;

module.exports = { signup, login, otpVerify,updateProfile,SendOtp,otpVerifyAndSignup };
