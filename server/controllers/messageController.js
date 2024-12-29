const Message = require("../models/Message");

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).send(messages);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const createMessage = async (req, res) => {
  try {
    console.log(req.body);
    const message = await Message.create(req.body);
    console.log(message);
    res.status(200).send({ message: "Message sent" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const id = req.body._id;
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).send({ message: "Message not found" });
    }
    await message.remove();
    res.status(200).send({ message: "Message deleted" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  deleteMessage,
};
