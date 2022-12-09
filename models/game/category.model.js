import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  categoryName: String,
  description: String,
  id: String,
  icon: String,
});

const Category = mongoose.model("categories", categorySchema);

export default Category;
