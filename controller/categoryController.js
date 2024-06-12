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
  const isExists = await user.findOne({
    where: {
      phoneNumber: req.body.phoneNumber,
    },
  });
  console.log("--created category",isExists);
  if (isExists) {
    isExists.categories = req.body.categories;
    await isExists.save();
    return res.json({
      status: true,
      message: "category update succesfully",
    });
  }
};

const getCategoriesById = async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;

    // Query the database to find categories by phone number
    const foundCategories = await user.findAll({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    // Return the categories to the user
    if (foundCategories) {
      const categoryArray =
        foundCategories.length > 0 ? foundCategories[0] : [];
      console.log(" Found categories", foundCategories[0].categories);
      return res.status(200).json({
        status: true,
        categories: categoryArray.categories,
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
