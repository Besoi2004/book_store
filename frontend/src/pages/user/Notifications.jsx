import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  useGetUserNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} from "../../redux/features/notifications/notificationsApi";
import { 
  FaBell, 
  FaCheck, 
  FaTrash, 
  FaShoppingCart, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle,
  FaExclamationCircle,
  FaEnvelope
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import Swal from "sweetalert2";

const Notifications = () => {
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;

  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useGetUserNotificationsQuery(userEmail, {
    skip: !userEmail,
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaBell className="mx-auto text-6xl text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">Vui lòng đăng nhập để xem thông báo</p>
          <Link
            to="/login"
            className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationCircle className="mx-auto text-6xl text-red-500 mb-4" />
          <p className="text-xl text-gray-600 mb-4">Lỗi tải thông báo</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order_confirmed":
        return <FaCheck className="text-blue-500 text-2xl" />;
      case "order_shipping":
        return <FaTruck className="text-yellow-500 text-2xl" />;
      case "order_delivered":
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      case "order_cancelled":
        return <FaTimesCircle className="text-red-500 text-2xl" />;
      case "contact_response":
        return <FaEnvelope className="text-purple-500 text-2xl" />;
      default:
        return <FaShoppingCart className="text-gray-500 text-2xl" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ xử lý" },
      confirmed: { bg: "bg-blue-100", text: "text-blue-800", label: "Đã xác nhận" },
      shipping: { bg: "bg-purple-100", text: "text-purple-800", label: "Đang giao" },
      delivered: { bg: "bg-green-100", text: "text-green-800", label: "Đã giao" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Đã hủy" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(userEmail).unwrap();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã đánh dấu tất cả thông báo là đã đọc",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể đánh dấu đã đọc",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xóa thông báo?",
      text: "Bạn có chắc muốn xóa thông báo này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await deleteNotification(id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Đã xóa",
          text: "Thông báo đã được xóa",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể xóa thông báo",
        });
      }
    }
  };

  const handleDeleteAll = async () => {
    const result = await Swal.fire({
      title: "Xóa tất cả thông báo?",
      text: "Bạn có chắc muốn xóa tất cả thông báo? Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa tất cả",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await deleteAllNotifications(userEmail).unwrap();
        Swal.fire({
          icon: "success",
          title: "Đã xóa",
          text: "Tất cả thông báo đã được xóa",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể xóa thông báo",
        });
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <FaBell className="text-3xl text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Thông báo</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? (
                    <span className="font-semibold text-primary">
                      {unreadCount} thông báo mới
                    </span>
                  ) : (
                    "Bạn không có thông báo mới"
                  )}
                </p>
              </div>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <FaCheck /> Đánh dấu đã đọc
                  </button>
                )}
                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <FaTrash /> Xóa tất cả
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBell className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-600 mb-2">Chưa có thông báo nào</p>
            <p className="text-gray-500">
              Bạn sẽ nhận được thông báo khi có cập nhật về đơn hàng
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg ${
                  !notification.isRead ? "border-l-4 border-primary" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="ml-2 px-2 py-1 bg-primary text-white text-xs rounded-full">
                          Mới
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {getStatusBadge(notification.orderStatus)}
                      <span className="text-sm text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>
                      <Link
                        to="/user/dashboard/orders"
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        Xem đơn hàng →
                      </Link>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Đánh dấu đã đọc"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
