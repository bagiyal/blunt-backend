const { firebase } = require("./firebase");

const sendNotification = () => {
  firebase.messaging().send({
    token: "device_token",
    notification: {
      title: "This is muhfat app ",
      body: "check out our paragraph",
    },
  });
};
