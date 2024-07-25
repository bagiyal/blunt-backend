const {
  createNews,
  getAllNews,
  getNewById,
  deleteNewsById,
  getNewsByCategory,
  getPrimaryNews,
  saveNews,
  getSavedNews,
} = require("../controller/newsController");
const search = require("../controller/search");

const router = require("express").Router();

router.route("/create-news").post(createNews);

router.route("/getallnews").get(getAllNews);
router.route("/getNewsById/:category/:id").get(getNewById);
router.route("/deleteNewsById/:id").delete(deleteNewsById);
router.route("/getNewsByCategory/:category").get(getNewsByCategory);
router.route("/getPrimaryNews").get(getPrimaryNews);

router.route("/saveNews").post(saveNews);
router.route("/getSavedNews").post(getSavedNews);
router.route("/search").get(search);
module.exports = router;
