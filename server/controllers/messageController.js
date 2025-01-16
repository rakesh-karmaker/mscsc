const Message = require("../models/Message");
const { paginatedResults } = require("../utils/paginatedResults");
const { messageSchema } = require("../utils/validation");

const getAllMessages = async (req, res) => {
  try {
    const regex = {
      name: new RegExp(req.query.name, "i"),
    };
    const sorted = { _id: -1 };

    const messages = await paginatedResults(req, res, Message, regex, sorted);
    console.log("fetched all messages -", new Date().toUTCString());
    res.status(200).send(messages);
  } catch (err) {
    console.log(
      "Error fetching all messages - ",
      new Date().toUTCString(),
      "\n---\n",
      err
    );
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
    console.log("Message sent successfully -", new Date().toUTCString());
    res.status(200).send({ message: "Message sent" });
  } catch (err) {
    console.log(
      "Error sending message - ",
      new Date().toUTCString(),
      "\n---\n",
      err
    );
    res.status(500).send({ message: err.message });
  }
};

const editMessage = async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body._id;
    const message = await Message.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (!message) {
      return res.status(404).send({ message: "Message not found" });
    }
    res.status(200).send({ message: "Message updated" });
  } catch (err) {
    console.log(
      "Error updating message - ",
      new Date().toUTCString(),
      "\n---\n",
      err
    );
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
    console.log(
      "Message deleted successfully -",
      new Date().toUTCString(),
      "\n---\n"
    );
    res.status(200).send({ message: "Message deleted" });
  } catch (err) {
    console.log(
      "Error deleting message - ",
      new Date().toUTCString(),
      "\n---\n",
      err
    );
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  editMessage,
  deleteMessage,
};
