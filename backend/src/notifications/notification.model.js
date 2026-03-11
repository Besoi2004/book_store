const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true, // Index for faster queries by email
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["order_update", "order_confirmed", "order_shipping", "order_delivered", "order_cancelled", "contact_response"],
      default: "order_update",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
      required: false,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
notificationSchema.index({ email: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
