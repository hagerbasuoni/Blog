import Blog from "../models/blog.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { tokenExtractor } from "../utils/middelware.js";
const getAllBlogs = async (req, res) => {
  try {
    const { search,author ,sortBy,order,page,limit} = req.query;
    let filter = {};
    let sorting ={}
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i", //case=insensitive
      };
    }
    if (author) {
      filter.author = {
        $regex: author,
        $options: "i", //case=insensitive
      };
    }
    if (sortBy) {
      const sortfield = ['likes']
      if (!sortfield.includes(sortBy)) {
        return res.status(400).json({ error: `Sorting by ${sortBy} is not supported` });
      }
      const sortOrder = order === "desc" ? -1 : 1;
      sorting[sortBy]=sortOrder
    }
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const totalBlogs = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(totalBlogs / limitNum);
    const blogs = await Blog.find(filter)
      .sort(sorting)
      .skip(skip)
      .limit(limitNum)
      .populate("user", {
        name: 1,
      });;
    res.status(200).json({
      status: "success",
      pagination: {
        currentPage: pageNum,
        pageSize: blogs.length,
        totalBlogs: totalBlogs,
        totalPages: totalPages,
      },
      data: { blogs },
    });
  } catch (err) {
    next(err)
  }
};
const createBlog = async (req, res) => {
  try {
    const { title, author, url, likes } = req.body;
    const user = req.user; 
    if (!user) {
      return response.status(401).json({ error: "token missing or invalid" });
    }
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
  } catch (err) {
    next(err)
  
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
    next(err);
  }
}
const deleteBlog = async (req, res) => {
  try
  {
    const user = req.user;

  if (!user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }
  if (blog.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: "only the creator can delete this blog" });
  }

  await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }
  catch (err) {
    next(err)
  }
}
export { createBlog, getAllBlogs, updateLikes, deleteBlog };