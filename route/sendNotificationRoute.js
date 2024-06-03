const {
  SendNotification,
  StoreDeviceToken,
} = require("../controller/SendNotificationController");

const router = require("express").Router();

router.route("/send-notification").post(SendNotification);

router.route("/store-device-token").post(StoreDeviceToken);

module.exports = router;
