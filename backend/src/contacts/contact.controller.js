const Contact = require("./contact.model");
const Notification = require("../notifications/notification.model");

// Create a new contact request
const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message, bookRequestTitle, topic } = req.body;

    const newContact = new Contact({
      name,
      email,
      phone: phone || "",
      subject,
      topic: topic || "",
      message,
      bookRequestTitle: bookRequestTitle || "",
      status: "pending",
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Yêu cầu của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.",
      contact: newContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({
      success: false,
      message: "Không thể gửi yêu cầu. Vui lòng thử lại sau.",
    });
  }
};

// Get all contact requests (Admin only)
const getAllContacts = async (req, res) => {
  try {
    const { status, topic } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (topic) query.topic = topic;
    
    const contacts = await Contact.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tải danh sách yêu cầu.",
    });
  }
};

// Get a single contact request
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu.",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tải thông tin yêu cầu.",
    });
  }
};

// Update contact status and admin notes (Admin only)
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    // Get the contact before update to check status change
    const oldContact = await Contact.findById(id);
    
    if (!oldContact) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu.",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    // Create notification when status changes to responded or resolved
    if ((status === "responded" || status === "resolved") && oldContact.status !== status) {
      const statusMessages = {
        responded: {
          title: "Yêu cầu của bạn đã được phản hồi",
          label: "đã được phản hồi",
        },
        resolved: {
          title: "Yêu cầu của bạn đã được giải quyết",
          label: "đã được giải quyết",
        },
      };

      const { title, label } = statusMessages[status];
      const replyPart = adminNotes ? `\n\nPhản hồi từ cửa hàng: ${adminNotes}` : "";

      const notification = new Notification({
        email: contact.email,
        contactId: contact._id,
        title,
        message: `Yêu cầu "${contact.subject}" của bạn ${label}.${replyPart}`,
        type: "contact_response",
        isRead: false,
      });

      await notification.save();
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật yêu cầu thành công.",
      contact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật yêu cầu.",
    });
  }
};

// Delete a contact request (Admin only)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa yêu cầu thành công.",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa yêu cầu.",
    });
  }
};

// Get contact statistics (Admin only)
const getContactStats = async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const pendingContacts = await Contact.countDocuments({ status: "pending" });
    const respondedContacts = await Contact.countDocuments({ status: "responded" });
    const resolvedContacts = await Contact.countDocuments({ status: "resolved" });
    const bookRequests = await Contact.countDocuments({ bookRequestTitle: { $ne: "" } });

    res.status(200).json({
      success: true,
      stats: {
        total: totalContacts,
        pending: pendingContacts,
        responded: respondedContacts,
        resolved: resolvedContacts,
        bookRequests: bookRequests,
      },
    });
  } catch (error) {
    console.error("Error fetching contact stats:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tải thống kê.",
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStats,
};
