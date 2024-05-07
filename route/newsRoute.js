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

const router = require("express").Router();

router.route("/create-news").post(createNews);

router.route("/getallnews").get(getAllNews);
router.route("/getNewsById/:id").get(getNewById);
router.route("/deleteNewsById/:id").delete(deleteNewsById);
router.route("/getNewsByCategory/:category").get(getNewsByCategory);
router.route("/getPrimaryNews").get(getPrimaryNews);

router.route("/saveNews").post(saveNews);
router.route("/getSavedNews/:phoneNumber").get(getSavedNews);

module.exports = router;
