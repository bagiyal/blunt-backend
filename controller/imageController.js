const multer = require("multer");

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Controller function for handling image uploads
const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    const filename = req.file.filename;
    console.log(" req file: " + filename);
    // Construct the link to the uploaded image
    const link = `http://${process.env.DB_HOST}:${process.env.APP_PORT}/uploads/${filename}`;
    res.status(200).json({
      link: link,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports = { uploadImage };
