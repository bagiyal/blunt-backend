const {
  getCategories,
  addCategory,
  getCategoriesById,
} = require("../controller/categoryController");
const { route } = require("./authRoute");

const router = require("express").Router();

router.route("/getCategories").get(getCategories);
router.route("/add-category").post(addCategory);
router.route("/getCategoriesById").post(getCategoriesById);

module.exports = router;
