const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    const filename = req.file.filename;
    console.log(" req file: " + filename);
    // Construct the link to the uploaded image
    const link = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
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
