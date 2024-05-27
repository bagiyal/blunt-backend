const firebase = require("firebase-admin");

const serviceAccount = require("./");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

module.exports = { firebase };
