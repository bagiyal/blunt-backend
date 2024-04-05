const categories = require("../db/models/categories");
const getCategories = async (req, res) => {
  const categories = [
    "Politics",
    "Sports",
    "Technology",
    "Entertainment",
    "Health",
    "Science",
    "Business",
    "Travel",
    "Food",
  ];

  return res.json({
    categories: categories,
  });
};

const addCategory = async (req, res) => {
  const createdCategory = await categories.findOne({
    where: {
      phoneNumber: req.body.phoneNumber,
    },
  });
  if (createdCategory) {
    return res.json({
      status: false,
      message: "Category already exists",
    });
  }
  const newCategory = await categories.create({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    categories: req.body.categories,
  });
  return res.json({
    status: true,
    message: "category created successfully",
  });
};

const getCategoriesById = async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;

    // Query the database to find categories by phone number
    const foundCategories = await categories.findAll({
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
