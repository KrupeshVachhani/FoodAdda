import Message from "../models/Message.js";

export const createMessage = async (req, res) => {
  try {
    const { name, message } = req.body;
    const newMessage = new Message({ name, message });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default createMessage;
