const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create a SMTP transporter using your email service provider's settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    // user: "sajjadul306120@gmail.com",
    // pass: "dtakoaarrhlmmpyt",
  },
});

app.post("/place-order", (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    paymentMethod,
    selectedSize,
    quantity,
    subtotal,
    shippingCost,
    total,
    productName,
    productImg,
  } = req.body;

  // Email options
  const mailOptions = {
    from: email,
    to: process.env.TO, // Your email
    subject: "New Order Placed",
    html: `
        <h1>New Order Details</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Product Name:</strong> ${productName}</p>
        <img src="${productImg}" alt="Product Image" style="max-width: 200px;" />
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Subtotal:</strong> ${subtotal}</p>
        <p><strong>Shipping Cost:</strong> ${shippingCost}</p>
        <p><strong>Total:</strong> ${total}</p>
        <p><strong>Size:</strong> ${selectedSize}</p>
      `,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error: Unable to send email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Order placed successfully");
    }
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to your Express server");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
