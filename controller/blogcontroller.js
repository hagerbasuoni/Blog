import Blog from "../models/blog.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace("Bearer ",'');
  }
  return null;
}
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
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
const createBlog = async (req, res) => {
  try {
    const { title, author, url, likes } = req.body;
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return
      res.status(401).json({
        error:"token invalid"
      })
    }
    const user = await User.findById(decodedToken.id);
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