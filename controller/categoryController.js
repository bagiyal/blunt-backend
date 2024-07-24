const user = require("../db/models/user");
const getCategories = async (req, res) => {
  const categories = [
    "Trending",
    "Good News",
    "Business",
    "Politics",
    "Startup",
    "World",
    "Sports",
    "Entertainment",
    "Horoscope",
    "Tragic",
    "Bizarre",
    "Technology",
    "Breaking",
    "India",
    "Health & Fitness",
    "Curious",
  ];

  return res.json({
    categories: categories,
  });
};

const addCategory = async (req, res) => {
  try {
    const { phoneNumber, email, categories } = req.body;

    // Build the query conditionally based on the presence of phoneNumber or email
    let query = {};
    if (phoneNumber) {
      query.phoneNumber = phoneNumber;
    } else if (email) {
      query.email = email;
    } else {
      return res.status(400).json({
        status: false,
        message: "Either phoneNumber or email is required",
      });
    }

    const isExists = await user.findOne({ where: query });
    console.log("--created category", isExists);

    if (isExists) {
      isExists.categories = categories;
      await isExists.save();
      return res.json({
        status: true,
        message: "Category updated successfully",
        userData: isExists,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


const getCategoriesById = async (req, res) => {
  try {
    const { phoneNumber, email } = req.body;

    // Build the query conditionally based on the presence of phoneNumber or email
    let query = {};
    if (phoneNumber) {
      query.phoneNumber = phoneNumber.toString();
    } else if (email) {
      query.email = email;
    } else {
      return res.status(400).json({
        status: false,
        message: "Either phoneNumber or email is required",
      });
    }
    console.log("query",query);
    const foundCategories = await user.findOne({ where: query, attributes: ['categories']});
    console.log("categories",foundCategories.categories);
    // Return the categories to the user
    if (foundCategories) {
      return res.status(200).json({
        status: true,
        categories: foundCategories.categories,
      });
    } else {
      return res.json({
        status: false,
        categories: [],
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching categories",
    });
  }
};

module.exports = { getCategories, addCategory, getCategoriesById };
