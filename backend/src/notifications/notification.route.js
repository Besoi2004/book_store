const express = require("express");
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
} = require("./notification.controller");

const router = express.Router();

// Get notifications for a user
router.get("/:email", getUserNotifications);

// Get unread count for a user
router.get("/:email/unread/count", getUnreadCount);

// Mark notification as read
router.patch("/:id/read", markAsRead);

// Mark all notifications as read for a user
router.patch("/:email/read-all", markAllAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

// Delete all notifications for a user
router.delete("/:email/all", deleteAllNotifications);

module.exports = router;
