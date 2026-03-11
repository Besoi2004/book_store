const express = require("express");
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStats,
} = require("./contact.controller");
const verifyAdminToken = require("../middleware/verifyAdminToken");

const router = express.Router();

// Public route - Create a new contact request
router.post("/", createContact);

// Admin routes - require authentication
router.get("/stats", verifyAdminToken, getContactStats);
router.get("/", verifyAdminToken, getAllContacts);
router.get("/:id", verifyAdminToken, getContactById);
router.put("/:id", verifyAdminToken, updateContact);
router.delete("/:id", verifyAdminToken, deleteContact);

module.exports = router;
