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

module.exports = { getCategories };
