import Blog from "../models/blog.js";
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
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

    const newBlog = await Blog.create(req.body);
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
export  {
    createBlog,
    getAllBlogs,
    
};