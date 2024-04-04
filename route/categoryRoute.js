const {
  getCategories,
  addCategory,
} = require("../controller/categoryController");
const { route } = require("./authRoute");

const router = require("express").Router();

router.route("/getCategories").get(getCategories);
router.route("/add-category").post(addCategory);

module.exports = router;
