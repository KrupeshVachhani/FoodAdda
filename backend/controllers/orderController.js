import Order from "../models/Order.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const createOrder = async (req, res) => {
  try {
    const order = new Order({
      userName: req.body.userName,
      orderItems: req.body.orderItems,
      shippingInfo: req.body.shippingInfo,
      email: req.body.email,
      totalPrice: req.body.totalPrice,
    });

    await order.save();

    const sendOrderConfirmationEmail = async (order) => {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "service.foodadda@gmail.com",
          pass: "mjge ogsn xnnd hjkd",
        },
        tls: {
          ciphers: "SSLv3",
        },
      });

      const message = {
        from: "service.foodadda@gmail.com",
        to: req.body.email,
        subject: "Order Confirmation",
        text: `Your order has been placed successfully!`,
        html: `
          <p>Dear ${order.userName},</p>
          <p>Thank you for your order! Your order details are as follows:</p>
          <ul>
            <li>Order number: ${order.id}</li>
            <li>Order total: ${order.totalPrice}</li>
          </ul>
          <p>Your order will be shipped to the following address:</p>
          <p>House No. :- ${order.shippingInfo.Hno}</p>
          <p>City :- ${order.shippingInfo.city}</p>
          <p>Postal Code :- ${order.shippingInfo.postalCode}</p>
          <p>Phone Number :- ${order.shippingInfo.phoneNumber}</p>
          <p>We will send you an email notification when your order has been shipped.</p>
          <p>Thank you again for your order! We appreciate your business.</p>
          <p>Sincerely,</p>
          <p>The team at FoodAdda.com</p>
        `,
      };

      await transporter.sendMail(message);
    };

    await sendOrderConfirmationEmail(order);

    const successResponse = {
      success: true,
      message: "Order placed successfully.",
    };

    res.json(successResponse);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error.");
  }
};

export const getOrdersForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error.");
  }
};
export const getOrdersForAdmin = async (req, res) => {
  const { pass } = req.params;

  try {
    // Check if the password is correct
    if (pass !== "krupesh") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

