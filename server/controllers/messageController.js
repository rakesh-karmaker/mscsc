const Message = require("../models/Message");
const { paginatedResults } = require("../utils/paginatedResults");
const { messageSchema } = require("../utils/validation");

const getAllMessages = async (req, res) => {
  try {
    const regex = {
      name: new RegExp(req.query.search, "i"),
    };
    const sorted = { _id: -1 };
    const length = await Message.find({ ...regex }).countDocuments();
    const messages = await paginatedResults(
      req,
      Message,
      regex,
      length,
      sorted
    );
    res.status(200).send(messages);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

const createMessage = async (req, res) => {
  try {
    console.log(req.body);
    const { error: validationResult } = messageSchema.validate(req.body);
    if (validationResult) {
      return res.status(400).send({
        subject: validationResult.details[0].context.key,
        message: validationResult.details[0].message,
      });
    }
    const message = await Message.create(req.body);
    console.log(message);
    res.status(200).send({ message: "Message sent" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

const editMessage = async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body._id;
    const message = await Message.findByIdAndUpdate(
      id,
      { new: false },
      { new: true }
    );
    if (!message) {
      return res.status(404).send({ message: "Message not found" });
    }
    res.status(200).send({ message: "Message updated" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    console.log(req.body._id);
    const id = req.body._id;
    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).send({ message: "Message not found" });
    }
    res.status(200).send({ message: "Message deleted" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  editMessage,
  deleteMessage,
};
