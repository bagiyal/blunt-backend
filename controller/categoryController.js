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
  console.log(" type ", typeof categories, typeof users);

  const newCategory = await categories.create({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    categories: req.body.categories,
  });

  return res.json(newCategory);
};

module.exports = { getCategories, addCategory };
