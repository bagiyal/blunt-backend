const { getCategories } = require("../controller/categoryController");
const { route } = require("./authRoute");

const router = require("express").Router();

router.route("/getCategories").get(getCategories);

module.exports = router;
