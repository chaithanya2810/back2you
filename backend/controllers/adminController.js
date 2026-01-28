const Item = require('../models/Item');

exports.approveItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  item.approved = true;               //set the approved field of the item to true
  await item.save();                 //save the updated item into database
  res.json(item);                     //send updated item back to frontend
};

exports.rejectItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  item.approved = false;
  await item.save();
  res.json(item);
};

exports.getStats = async (req, res) => {
  const stats = await Item.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  // also get approved counts
  const approvedCount = await Item.countDocuments({ approved: true });
  res.json({ stats, approvedCount });
};
