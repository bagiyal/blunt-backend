const user = require("../db/models/user");

const signup = async (req, res, next) => {
  console.log(" req ", req.body);

  try {
    const newUser = await user.create({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
    });
    return res.json({
      status: true,
      data: newUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      status: "fail",
      message: "Failed to create the new user",
    });
  }
};

module.exports = { signup };
