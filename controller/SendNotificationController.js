const newspost = require("../db/models/newspost");
const { firebase } = require("../firebase");
const deviceToken = require("./../db/models/devicetoken");

const SendNotification = async (req, res) => {
  try {
    const newNewsPost = await newspost.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { id: req.body.id },
    });

    const newsData = newNewsPost ? newNewsPost.get({ plain: true }) : {};

    const tokens = await deviceToken.findAll({
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
        message: "Token saved successfully",
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

module.exports = { SendNotification, StoreDeviceToken };
