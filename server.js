const { firebase } = require("./firebase");

const sendNotification = () => {
  firebase.messaging().send({
    token: "device_token",
    notification: {
      title: "This is blunt app ",
      body: "check out our paragraph",
    },
  });
};
