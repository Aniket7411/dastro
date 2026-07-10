import CourseCategory from '../models/CourseCategory.js';
import { slugify, uniqueSlug } from '../utils/slugify.js';

const formatCategory = (cat) => ({
  _id: cat._id,
  name: cat.name,
  slug: cat.slug,
  description: cat.description || '',
  sortOrder: cat.sortOrder ?? 0,
  isActive: cat.isActive,
});

export const getPublicCategories = async (_req, res) => {
  try {
    const categories = await CourseCategory.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    res.json({ success: true, categories: categories.map(formatCategory) });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAdminCategories = async (_req, res) => {
  try {
    const categories = await CourseCategory.find().sort({ sortOrder: 1, name: 1 }).lean();
    res.json({ success: true, categories: categories.map(formatCategory) });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, sortOrder } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const slug = await uniqueSlug(CourseCategory, req.body.slug || name);
    const category = await CourseCategory.create({
      name: name.trim(),
      slug,
      description: description || '',
      sortOrder: Number(sortOrder) || 0,
    });
    res.status(201).json({ success: true, category: formatCategory(category) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category slug already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await CourseCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, description, sortOrder, isActive, slug: rawSlug } = req.body;
    if (name !== undefined) category.name = name.trim();
    if (description !== undefined) category.description = description;
    if (sortOrder !== undefined) category.sortOrder = Number(sortOrder) || 0;
    if (isActive !== undefined) category.isActive = !!isActive;
    if (rawSlug !== undefined) {
      category.slug = await uniqueSlug(CourseCategory, rawSlug || category.name, category._id);
    } else if (name !== undefined && !rawSlug) {
      category.slug = await uniqueSlug(CourseCategory, name, category._id);
    }

    await category.save();
    res.json({ success: true, category: formatCategory(category) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category slug already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await CourseCategory.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deactivated' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { slugify };
