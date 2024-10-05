const newsposts = require("./../db/models/newspost");
const user = require("./../db/models/user");
const { Op } = require("sequelize");
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
    const newNewsPost = await newsposts.findAll({
      attributes: { exclude: ["createdAt", "updatedAt","isVisible","isPrimary"] },
      where: { isPrimary: true },
    });
    const finalData = {
      message : "success",
      status : true,
      data : newNewsPost,
    }
    return res.status(200).json(finalData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNewById = async (req, res) => {
  const id = req.params.id;
  const selectedCategory = req.params.category;

  try {
    // Fetch the specific news article by ID
    const currentNews = await newsposts.findOne({
      where: { id: id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!currentNews) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
      });
    }
    let nextFiveNews = await newsposts.findAll({
      where: {
        id: { [Op.gt]: id }, // Find news articles with id greater than the current id
        category: { [Op.contains]: [selectedCategory] }
      },
      order: [['id', 'ASC']], // Order by id to get the next in sequence
      limit: 5, 
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    // If fewer than 4 articles are found, fetch the remaining from the beginning
    if (nextFiveNews.length < 4) {
      const remainingCount = 5 - nextFiveNews.length;
      const additionalNews = await newsposts.findAll({
        where: {
          id: { [Op.ne]: id }, // Ensure we don't include the current news again
          category: { [Op.contains]: [selectedCategory] },
        },
        order: [['id', 'ASC']],
        limit: remainingCount,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      nextFiveNews = [...nextFiveNews, ...additionalNews];
    }
    // Combine the current news article with the latest news articles
    const newsList = [currentNews, ...nextFiveNews];

    res.status(200).json({
      status: true,
      message: "Success",
      data: newsList
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
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


const saveNews = async (req, res) => {
  try {
    const existing = await user.findOne({
      where: { phoneNumber: req.body.phoneNumber.toString() },
    });

    if (existing) {
      let updateArray = Array.isArray(existing.savedNewsId) ? [...existing.savedNewsId] : [];

      const newsIds = Array.isArray(req.body.id) ? req.body.id : [req.body.id];
      console.log(" news is ",updateArray,newsIds);
      let message = '';
      let status = true;

      newsIds.forEach(newsId => {
        const index = updateArray.indexOf(newsId);
        console.log(" index is ",index);
        if (index > -1) {
          // If it exists, remove it from the array
          updateArray.splice(index, 1);
          message = "News ID removed successfully";
        } else {
          // If it does not exist, add it to the array
          updateArray.push(newsId);
          message = "News ID added successfully";
        }
      });

      await existing.update({ savedNewsId: updateArray });

      return res.status(200).json({
        message,
        status,
        savedNewsId: updateArray,
      });
    } else {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error saving news:", error);

    // Log validation errors, if any
    if (error.name === "SequelizeValidationError") {
      console.error("Validation errors:", error.errors);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getSavedNews = async (req, res) => {
  try {
    // const phoneNumber = req.body.phoneNumber;
    const { phoneNumber, email } = req.body;

    // Build the query conditionally based on the presence of phoneNumber or email
    let query = {};
    if (phoneNumber) {
      query.phoneNumber = phoneNumber.toString();
    } else if (email) {
      query.email = email.toLowerCase();
    } else {
      return res.status(400).json({
        status: false,
        message: "Either phoneNumber or email is required",
      });
    }

    const existing = await user.findOne({ where: query });
    // const existing = await user.findOne({
    //   where: { phoneNumber: phoneNumber.toString() },
    // });
    if (existing && existing.savedNewsId) {
      let updateArray = [...existing.savedNewsId];
      const data = [];
    console.log("Query:", updateArray);
      for (const element of updateArray) {
        try {
          const newNewsPost = await newsposts.findOne({
            attributes: { exclude: ["createdAt", "updatedAt"] },
            where: { id: element },
          });
          if (newNewsPost) {
            data.push(newNewsPost);
          }
        } catch (error) {
          console.error("Error retrieving news post:", error);
          // Handle the error appropriately
        }
      }
      // console.log(" element: " + JSON.stringify(data));
      return res.status(200).json({
        message: "news found",
        status: true,
        savedNews: data,
      });
    } else {
      return res.status(400).json({
        message: "news not found",
        status: false,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "no save news found",
      status: false,
    });
    // console.log(error);
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewById,
  deleteNewsById,
  getNewsByCategory,
  getPrimaryNews,
  saveNews,
  getSavedNews,
};
