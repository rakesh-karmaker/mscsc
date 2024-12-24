const Event = require("../models/Activity");

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.send(events);
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Add New Event
exports.addEvent = async (req, res) => {
  try {
    const { heading, details, workshopTag, workshopDate, coverImage } =
      req.body;
    // const event = new Event({
    //   heading,
    //   details,
    //   workshopTag,
    //   workshopDate,
    //   coverImage,
    // });
    const event = new Event({
      tag: "workshop",
      status: "happened",
      title: "Psychology & Human Brain",
      description:
        "I hope you're doing well. We are excited to announce that we are arranging a workshop on Friday. Our respected Alumni will also attend to say a few words to our general members!",
      date: "11-10-2024",
      coverImage: "psycho&humanbrain.jpg",
    });
    await event.save();
    res.status(201).send(event);
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) return res.status(404).send({ message: "Event not found" });
    res.send(event);
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).send({ message: "Event not found" });
    res.send({ message: "Event deleted" });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};
