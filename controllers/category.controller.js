export const fetchCategoriesController = async (req, res) => {
  try {
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Fetch categories failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};
