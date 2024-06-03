const NewsPost = require("./../db/models/newspost");
const { Sequelize } = require("sequelize");
const search = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  } else {
    try {
      const results = await NewsPost.findAll({
        where: {
          [Sequelize.Op.or]: [
            {
              title: {
                [Sequelize.Op.iLike]: `%${query}%`,
              },
            },
            {
              tags: {
                [Sequelize.Op.contains]: [query],
              },
            },
          ],
        },
        attributes: {
          exclude: [
            // "content",
            // "category",
            // "image",
            // "tags",
            // "newsSourceLink",
            // "newsSourceName",
            // "isPrimary",
            // "isVisible",
            "createdAt",
            "updatedAt",
          ],
        },
      });

      res.status(200).json({
        data: results,
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = search;
