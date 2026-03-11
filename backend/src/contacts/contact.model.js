const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    phone: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      enum: [
        'cancel_order',
        'not_received',
        'return_exchange',
        'payment_issue',
        'product_inquiry',
        'product_complaint',
        'book_request',
        'other',
      ],
      default: '',
    },
    message: {
      type: String,
      required: true,
    },
    bookRequestTitle: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "responded", "resolved"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for efficient querying
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
