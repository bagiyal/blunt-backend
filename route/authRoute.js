const { signup, login, otpVerify, updateProfile, SendOtp, otpVerifyAndSignup, emailVerify } = require("../controller/authController");

const router = require("express").Router();

router.route("/auth/login").post(login);
router.route("/send-otp").post(SendOtp);
router.route("/auth/otp-verify").post(otpVerifyAndSignup);
router.route("/auth/email-verify").post(emailVerify);
router.route("/auth/signup").post(signup);

router.route("/profile/update").post(updateProfile);

module.exports = router;
