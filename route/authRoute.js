const { signup, login, otpVerify, updateProfile } = require("../controller/authController");

const router = require("express").Router();

router.route("/auth/login").post(login);

router.route("/auth/otp-verify").post(otpVerify);

router.route("/auth/signup").post(signup);

router.route("/profile/update").post(updateProfile);

module.exports = router;
