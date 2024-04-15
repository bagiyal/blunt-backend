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

module.exports = { createNews };
