const { firebase } = require("../firebase");
const deviceToken = require("./../db/models/devicetoken");

const SendNotification = async (req, res) => {
  try {
    await firebase.messaging().send({
      token: "e2Ya0hiOSES4svSv5b7JDE:APA91bH9uMeQtru8bu-s0CSgmLiSQpnLWLaiITPwnHNy-8pg_iRrv1QJyZ-COj7e8Cw0K3YqJO7YzoGSMyTDo63XD0AKhfjPVmJyB4IjX47vgyqaVQRB756J-DKAxa8OmqjFAH1IhE5r",
      notification: {
        title: " Blunt Title ",
        body: "the Blunt body ",
      },
    });
    res.status(200).json({
      status: true,
      message: "notification successfully sent",
    });
  } catch (error) {
    res.status(202).json({
      status: false,
      message: "notification failed",
    });
  }
};

const StoreDeviceToken = async (req, res) => {
  const { phoneNumber, token } = req.body;
  // console.log("phone token", typeof phoneNumber, token);

  try {
    let existingUser = await deviceToken.findOne({ where: { phoneNumber } });
    // console.log("existing user", existingUser);

    if (existingUser) {
      // If user exists, update the token
      existingUser.token = token;
      await existingUser.save();
      res.status(200).json({
        status: true,
        message: "Token updated successfully",
        data: existingUser,
      });
    } else {
      // If user does not exist, create a new record
      const create = await deviceToken.create({
        phoneNumber: phoneNumber,
        token: token,
      });

      res.status(201).json({
        status: true,
        message: "Token created successfully",
        data: create,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "failed",
      error: error.message,
    });
  }
};

module.exports = StoreDeviceToken;


module.exports = StoreDeviceToken;


module.exports = { SendNotification , StoreDeviceToken };
