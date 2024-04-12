const { createNews } = require("../controller/newsController");

const router = require("express").Router();

router.route("/create-news").post(createNews);

module.exports = router;
