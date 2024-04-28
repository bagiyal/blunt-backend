const {
  createNews,
  getAllNews,
  getNewById,
  deleteNewsById,
  getNewsByCategory,
  getPrimaryNews,
} = require("../controller/newsController");

const router = require("express").Router();

router.route("/create-news").post(createNews);

router.route("/getallnews").get(getAllNews);
router.route("/getNewsById/:id").get(getNewById);
router.route("/deleteNewsById/:id").delete(deleteNewsById);
router.route("/getNewsByCategory/:category").get(getNewsByCategory);
router.route("/getPrimaryNews").get(getPrimaryNews);

module.exports = router;
