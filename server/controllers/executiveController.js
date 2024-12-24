const Executive = require('../models/Executive');

// Get All Executives
exports.getExecutives = async (req, res) => {
  try {
    const executives = await Executive.find();
    res.send(executives);
  } catch (err) {
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

// Add New Executive
exports.addExecutive = async (req, res) => {
  try {
    const { name, about, socialLinks, image } = req.body;
    const executive = new Executive({ name, about, socialLinks, image });
    await executive.save();
    res.status(201).send(executive);
  } catch (err) {
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

// Update Executive
exports.updateExecutive = async (req, res) => {
  try {
    const executive = await Executive.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!executive) return res.status(404).send({ message: 'Executive not found' });
    res.send(executive);
  } catch (err) {
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

// Delete Executive
exports.deleteExecutive = async (req, res) => {
  try {
    const executive = await Executive.findByIdAndDelete(req.params.id);
    if (!executive) return res.status(404).send({ message: 'Executive not found' });
    res.send({ message: 'Executive deleted' });
  } catch (err) {
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};
