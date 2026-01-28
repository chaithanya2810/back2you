const Item = require('../models/Item');

exports.createItem = async (req, res) => {
  const { title, description, category, date, location, status } = req.body;

  // Store only relative path, never full disk path
  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  const newItem = await Item.create({
    title,
    description,
    category,
    date,
    location,
    status: status || 'lost',
    imagePath,
    postedBy: req.user.id,
    approved: false
  });

  res.status(201).json(newItem);
};


exports.getItems = async (req, res) => {
  try {
    // filters: category, status, dateFrom, dateTo, q(search text), page, limit
    const { category, status, q, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (q) filter.$text = { $search: q }; // requires text index if used
    const items = await Item.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page-1)*limit)
      .limit(Number(limit));
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  const item = await Item.findById(req.params.id).populate('postedBy', 'name email');
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

exports.updateItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });

  if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not allowed' });

  // Update fields from request body
  Object.assign(item, req.body);

  // If new file uploaded, store only relative path
  if (req.file) {
    item.imagePath = `/uploads/${req.file.filename}`;
  }

  await item.save();
  res.json(item);
};


exports.deleteItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not allowed' });
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

exports.markReturned = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  item.status = 'returned';
  await item.save();
  res.json(item);
};

//recieves data from frontend, uses item model to save new item in database,