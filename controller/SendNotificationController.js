const newspost = require("../db/models/newspost");
const { firebase } = require("../firebase");
const user = require("../db/models/user");

const SendNotification = async (req, res) => {
  try {
    const newNewsPost = await newspost.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { id: req.body.id },
    });

    const newsData = newNewsPost ? newNewsPost.get({ plain: true }) : {};

    const tokens = await user.findAll({
      attributes: ["token"],
    });

    const tokenList = tokens.map((token) => token.token);
    
    // Split the tokenList into batches of 500 (maximum allowed by sendMulticast)
    const batchSize = 500;
    const messages = [];
    for (let i = 0; i < tokenList.length; i += batchSize) {
      const batch = tokenList.slice(i, i + batchSize);
      const message = {
        notification: { title: req.body.customTitle },
        tokens: batch, // 'tokens' should be an array of token strings
        data: {
          navigationId: 'news-detail',
          newsData : JSON.stringify(newsData)
        }
      };
      messages.push(message);
    }
    console.log("messages",messages);
    // Send the batch of notifications
    for (const message of messages) {
      await firebase.messaging().sendEachForMulticast(message);
    }

    res.status(200).json({
      status: true,
      message: "Notifications successfully sent",
      data: newsData,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({
      status: false,
      message: "Notifications failed",
    });
  }
};


const StoreDeviceToken = async (req, res) => {

  const { phoneNumber, email,token } = req.body;
  let query = {};
  if (phoneNumber) {
    query.phoneNumber = phoneNumber;
  } else if (email) {
    query.email = email;
  } else {
    return res.status(400).json({
      status: false,
      message: "Either phoneNumber or email is required",
    });
  }
  try {
  console.log("phone token", query);
    const existingUser = await user.findOne({where: query});
    console.log("existing user", existingUser);

    if (existingUser) {
      // If user exists, update the token
      existingUser.token = token;
    console.log("existing user 2-", existingUser.token);
      await existingUser.save();
      res.status(200).json({
        status: true,
        message: "Token updated successfully",
        data: existingUser,
      });
    }else {
      return res.status(400).json({
        status: false,
        message: "enter correct email and phone number",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: false,
      message: "failed",
      error: error.message,
    });
  }
};

module.exports = StoreDeviceToken;

module.exports = StoreDeviceToken;

module.exports = { SendNotification, StoreDeviceToken };
