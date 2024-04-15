const { uploadImage } = require("../controller/imageController");
const multer = require("multer"); // Import Multer here

const router = require("express").Router();
// const upload = multer(); // Create a Multer instance
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
router.post("/upload-image", upload.single("image"), uploadImage);

module.exports = router;
