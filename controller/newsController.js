const newsposts = require("./../db/models/newspost");
const createNews = async (req, res) => {
  try {
    const newNewsPost = await newsposts.create({
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      category: req.body.category,
      tags: req.body.tags,
    });
    return res.status(201).json(newNewsPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllNews = async (req, res) => {
  try {
    const newNewsPost = await newsposts.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
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

module.exports = { createNews, getAllNews, getNewById, deleteNewsById };
