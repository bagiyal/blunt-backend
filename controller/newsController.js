const newsposts = require("./../db/models/newspost");
const createNews = async (req, res) => {
  try {
    let existingNewsPost = await newsposts.findByPk(req.body.id);

    if (existingNewsPost) {
      // Update existing news post
      existingNewsPost.title = req.body.title;
      existingNewsPost.content = req.body.content;
      existingNewsPost.image = req.body.image;
      existingNewsPost.category = req.body.category;
      existingNewsPost.tags = req.body.tags;
      existingNewsPost.newsSourceLink = req.body.newsSourceLink;
      existingNewsPost.newsSourceName = req.body.newsSourceName;
      existingNewsPost.isPrimary = req.body.isPrimary;
      existingNewsPost.isVisible = req.body.isVisible;
      await existingNewsPost.save();
      return res.status(200).json(existingNewsPost);
    } else {
      // Create new news post
      const newNewsPost = await newsposts.create({
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        category: req.body.category,
        tags: req.body.tags,
        newsSourceLink: req.body.newsSourceLink,
        newsSourceName: req.body.newsSourceName,
        isPrimary: req.body.isPrimary,
        isVisible: req.body.isVisible,
      });
      return res.status(201).json(newNewsPost);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllNews = async (req, res) => {
  try {
    const newNewsPost = await newsposts.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { isVisible: true },
    });
    return res.status(200).json(newNewsPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPrimaryNews = async (req, res) => {
  try {
    const newNewsPost = await newsposts.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { isPrimary: true },
    });
    return res.status(200).json(newNewsPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNewById = async (req, res) => {
  const id = req.params.id;
  try {
    const newNewsPost = await newsposts.findOne({
      where: { id: id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (newNewsPost == null) {
      res.status(200).json({
        status: false,
        message: "Date not found",
      });
    } else {
      return res.status(200).json(newNewsPost);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteNewsById = async (req, res) => {
  const id = req.params.id;
  console.log(" id ", id);
  try {
    const deletedNewsPost = await newsposts.destroy({ where: { id: id } });

    if (deletedNewsPost === 0) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Data deleted successfully",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNewsByCategory = async (req, res) => {
  const category = req.params.category; // Corrected to use req.params.category
  console.log("Category: ", category);
  try {
    const newNewsPost = await newsposts.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    const selectedNews = newNewsPost.filter((post) =>
      post.category.includes(category)
    );
    return res.status(200).json(selectedNews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewById,
  deleteNewsById,
  getNewsByCategory,
  getPrimaryNews,
};
