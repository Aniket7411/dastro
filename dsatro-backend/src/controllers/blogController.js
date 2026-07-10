import Blog from '../models/Blog.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = asyncHandler(async (req, res) => {
  const { category, search, limit } = req.query;
  const filter = { isPublished: true };

  if (category) filter.category = category;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ title: regex }, { excerpt: regex }, { content: regex }];
  }

  let query = Blog.find(filter).sort({ createdAt: -1 });
  const parsedLimit = parseInt(limit, 10);
  if (parsedLimit > 0) query = query.limit(parsedLimit);

  const blogs = await query;
  res.json({ success: true, blogs });
});

// @desc    Get all blogs for admin
// @route   GET /api/blogs/admin
// @access  Private/Admin
export const getAdminBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  res.json({ success: true, blogs });
});

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (blog) {
    res.json({ success: true, blog });
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = asyncHandler(async (req, res) => {
  const { title, slug, content, excerpt, category, image, tags, isPublished } = req.body;
  
  const blogExists = await Blog.findOne({ slug });
  if (blogExists) {
    res.status(400);
    throw new Error('Blog with this slug already exists');
  }

  const blog = await Blog.create({
    title, slug, content, excerpt, category, image, tags, isPublished
  });

  res.status(201).json({ success: true, blog });
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    blog.title = req.body.title || blog.title;
    blog.slug = req.body.slug || blog.slug;
    blog.content = req.body.content || blog.content;
    blog.excerpt = req.body.excerpt || blog.excerpt;
    blog.category = req.body.category || blog.category;
    blog.image = req.body.image || blog.image;
    blog.tags = req.body.tags || blog.tags;
    blog.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : blog.isPublished;

    const updatedBlog = await blog.save();
    res.json({ success: true, blog: updatedBlog });
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    await blog.deleteOne();
    res.json({ success: true, message: 'Blog removed' });
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});
