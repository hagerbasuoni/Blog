import Blog from "../models/blog.js";
import User from "../models/user.js";
const getAllBlogs = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i" //case=insensitive
      }
    }
    const blogs = await Blog.find(filter).populate("user", {
      name: 1,
    });;
    res.status(200).json({
      status: "success",
      result: blogs.length,
      data: { blogs },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
const createBlog = async (req, res) => {
  try {
    const { title, author, url, likes } = req.body;
    const user = await User.findOne({});
    const newBlog = await Blog.create({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id,
    });
    user.blogs = user.blogs.concat(newBlog._id);
    await user.save();
    res.status(201).json({
      status: "success",
      data: { newBlog },
    });
  } catch {
    res.status(400).json({
      status: "fail",
      message: "invalid data input",
    });
  }
};
const updateLikes = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true, runValidators: true },
    ).populate("user", { name: 1 });
    res.status(200).json({
      status: "success",
      data: { updatedBlog },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Blog not found",
    });
  }
}
export { createBlog, getAllBlogs, updateLikes };