const Order = require('./order.model');
const Book = require('../books/book.model');
const User = require('../users/user.model');
const Notification = require('../notifications/notification.model');
const Coupon = require('../coupons/coupon.model');
const Rank = require('../ranks/rank.model');

// Helper function to calculate tier based on rewardPoints
const calculateTier = (rewardPoints) => {
    if (rewardPoints >= 5000) return 'diamond';
    if (rewardPoints >= 2000) return 'gold';
    if (rewardPoints >= 500) return 'silver';
    return 'bronze';
};

// Helper function to create notification message
const getNotificationMessage = (status, orderName) => {
    const messages = {
        confirmed: {
            title: 'Đơn hàng đã được xác nhận',
            message: `Đơn hàng "${orderName}" của bạn đã được xác nhận và đang được chuẩn bị.`,
            type: 'order_confirmed'
        },
        shipping: {
            title: 'Đơn hàng đang được giao',
            message: `Đơn hàng "${orderName}" đang trên đường giao đến bạn.`,
            type: 'order_shipping'
        },
        delivered: {
            title: 'Đơn hàng đã được giao',
            message: `Đơn hàng "${orderName}" đã được giao thành công. Cảm ơn bạn đã mua hàng!`,
            type: 'order_delivered'
        },
        cancelled: {
            title: 'Đơn hàng đã bị hủy',
            message: `Đơn hàng "${orderName}" đã bị hủy. Vui lòng liên hệ với chúng tôi nếu bạn có thắc mắc.`,
            type: 'order_cancelled'
        },
        pending: {
            title: 'Đơn hàng đang chờ xử lý',
            message: `Đơn hàng "${orderName}" đang chờ được xác nhận.`,
            type: 'order_update'
        }
    };
    return messages[status] || messages.pending;
};

const createAOrder = async (req, res) => {
    try {
        // Tính tổng rewardPoints từ các sản phẩm (nhân với số lượng)
        let totalRewardPoints = 0;
        const productsWithDetails = [];
        
        if (req.body.productIds && req.body.productIds.length > 0) {
            const books = await Book.find({ _id: { $in: req.body.productIds } });
            const quantities = req.body.quantities || [];
            
            // Tạo map để dễ tra cứu
            const bookMap = {};
            books.forEach(book => {
                bookMap[book._id.toString()] = book;
            });
            
            // Kiểm tra stock trước khi đặt hàng
            const stockErrors = [];
            req.body.productIds.forEach((productId, index) => {
                const book = bookMap[productId.toString()];
                const quantity = quantities[index] || 1;
                
                if (!book) {
                    stockErrors.push(`Sản phẩm không tồn tại`);
                } else if (book.stock < quantity) {
                    stockErrors.push(`"${book.title}" chỉ còn ${book.stock} cuốn (bạn đặt ${quantity} cuốn)`);
                }
            });
            
            if (stockErrors.length > 0) {
                return res.status(400).json({ 
                    message: 'Không đủ hàng trong kho',
                    errors: stockErrors 
                });
            }
            
            // Tính tổng điểm và lưu chi tiết sản phẩm
            req.body.productIds.forEach((productId, index) => {
                const book = bookMap[productId.toString()];
                const quantity = quantities[index] || 1;
                
                if (book) {
                    // Lưu chi tiết sản phẩm
                    productsWithDetails.push({
                        productId: book._id,
                        title: book.title,
                        quantity: quantity,
                        price: book.newPrice
                    });
                    
                    // Tính điểm thưởng
                    if (book.rewardPoints) {
                        totalRewardPoints += book.rewardPoints * quantity;
                    }
                }
            });
            
            // Trừ stock của từng sản phẩm
            for (let i = 0; i < req.body.productIds.length; i++) {
                const productId = req.body.productIds[i];
                const quantity = quantities[i] || 1;
                
                await Book.findByIdAndUpdate(
                    productId,
                    { $inc: { stock: -quantity } },
                    { new: true }
                );
                
                console.log(`✅ Đã trừ ${quantity} cuốn sách ${productId}`);
            }
        }

        // Tạo order với rewardPoints và chi tiết sản phẩm
        const orderData = {
            ...req.body,
            products: productsWithDetails,
            rewardPointsEarned: totalRewardPoints,
            status: 'pending' // Đặt pending để chờ admin xác nhận
        };
        
        const newOrder = await Order(orderData);
        const savedOrder = await newOrder.save();

        // Tạo thông báo cho user khi đặt hàng thành công
        if (savedOrder.email) {
            try {
                const orderName = savedOrder.name || `#${savedOrder._id.toString().slice(-6)}`;
                const notification = new Notification({
                    email: savedOrder.email,
                    orderId: savedOrder._id,
                    title: '🎉 Đặt hàng thành công',
                    message: `Đơn hàng "${orderName}" đã được đặt thành công! Chúng tôi sẽ xác nhận đơn hàng của bạn trong thời gian sớm nhất. Bạn sẽ nhận được ${totalRewardPoints} điểm thưởng khi đơn hàng được xác nhận.`,
                    type: 'order_update',
                    orderStatus: 'pending',
                    isRead: false
                });
                await notification.save();
                console.log(`✅ Đã tạo thông báo đặt hàng cho user ${savedOrder.email}`);
            } catch (notifError) {
                console.error('⚠️ Lỗi tạo thông báo:', notifError);
                // Không throw error, vẫn trả về success cho order
            }
        }

        // CHỈ cộng rewardPoints khi admin xác nhận đơn (không cộng ngay)
        // Logic cộng điểm sẽ được xử lý ở API update status

        // Xử lý coupon nếu có sử dụng
        if (req.body.discounts && req.body.discounts.couponCode) {
            try {
                const couponCode = req.body.discounts.couponCode.toUpperCase();
                
                // Check if it's a rank coupon
                const rankCoupon = await Rank.findOne({ couponCode });
                
                if (rankCoupon) {
                    // This is a rank coupon - add to user's usedRankCoupons
                    if (savedOrder.email) {
                        const user = await User.findOne({ email: savedOrder.email });
                        if (user) {
                            if (!user.usedRankCoupons) {
                                user.usedRankCoupons = [];
                            }
                            if (!user.usedRankCoupons.includes(couponCode)) {
                                user.usedRankCoupons.push(couponCode);
                                await user.save();
                                console.log(`✅ Đã lưu rank coupon ${couponCode} vào user ${user.email}`);
                            }
                        }
                    }
                } else {
                    // Regular coupon - update usedCount
                    const coupon = await Coupon.findOne({ code: couponCode });
                    if (coupon) {
                        coupon.usedCount += 1;
                        await coupon.save();
                        console.log(`✅ Đã tăng usedCount của mã giảm giá ${coupon.code}`);
                    }
                }
            } catch (couponError) {
                console.error('⚠️ Lỗi xử lý coupon:', couponError);
                // Không throw error, vẫn cho phép đơn hàng được tạo
            }
        }

        res.status(200).json({
            ...savedOrder.toObject(),
            message: `Đặt hàng thành công! Đơn hàng đang chờ xác nhận. Bạn sẽ nhận được ${totalRewardPoints} điểm thưởng khi đơn hàng được xác nhận.`
        });

    } catch (error) {
        console.error('❌ Lỗi tạo đơn hàng:', error);
        res.status(500).json({ message: error.message });
    }
};

const GetOrdersByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const orders = await Order.find({ email }).sort({ createdAt: -1 });
        if (!orders) {
            return res.status(404).json({ message: 'No orders found for this email' });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Chỉ cho phép cập nhật khi đơn hàng đang pending
        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Chỉ có thể cập nhật đơn hàng đang chờ xác nhận' });
        }

        // Cập nhật thông tin
        Object.assign(order, updateData);
        await order.save();

        res.status(200).json({ message: 'Cập nhật đơn hàng thành công', order });
    } catch (error) {
        console.error('❌ Lỗi cập nhật đơn hàng:', error);
        res.status(500).json({ message: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Chỉ cho phép hủy khi đơn hàng đang pending và thanh toán COD
        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Không thể hủy đơn hàng đã được xác nhận' });
        }

        if (order.paymentMethod !== 'cod') {
            return res.status(400).json({ message: 'Không thể hủy đơn hàng thanh toán chuyển khoản. Vui lòng liên hệ nhà sách.' });
        }

        // Hoàn trả stock cho các sản phẩm
        if (order.products && order.products.length > 0) {
            for (const product of order.products) {
                await Book.findByIdAndUpdate(
                    product.productId,
                    { $inc: { stock: product.quantity } },
                    { new: true }
                );
                console.log(`✅ Đã hoàn trả ${product.quantity} cuốn "${product.title}" vào kho`);
            }
        } else if (order.productIds && order.productIds.length > 0) {
            // Fallback cho đơn hàng cũ không có chi tiết products
            console.log('⚠️ Đơn hàng cũ không có thông tin chi tiết, không thể hoàn trả stock chính xác');
        }

        order.status = 'cancelled';
        await order.save();

        res.status(200).json({ message: 'Đã hủy đơn hàng thành công và hoàn trả hàng vào kho', order });
    } catch (error) {
        console.error('❌ Lỗi hủy đơn hàng:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('productIds', 'title coverImage')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('❌ Lỗi lấy danh sách đơn hàng:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Kiểm tra status hợp lệ
        const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        const oldStatus = order.status;

        // Xử lý logic cộng điểm thưởng khi xác nhận đơn
        if (oldStatus === 'pending' && status === 'confirmed' && order.email) {
            const user = await User.findOne({ email: order.email });
            if (user && order.rewardPointsEarned > 0) {
                const oldTier = user.tier;
                
                // Cộng điểm thưởng
                user.rewardPoints = (user.rewardPoints || 0) + order.rewardPointsEarned;
                
                // Tự động cập nhật tier dựa trên điểm mới
                const newTier = calculateTier(user.rewardPoints);
                user.tier = newTier;
                
                await user.save();
                console.log(`✅ Đã cộng ${order.rewardPointsEarned} điểm cho user ${order.email}`);
                
                // Log nếu có tier upgrade
                if (oldTier !== newTier) {
                    console.log(`🎉 User ${order.email} đã lên hạng từ ${oldTier} lên ${newTier}!`);
                }
            }
        }

        // Xử lý logic hoàn trả stock khi hủy đơn
        if (status === 'cancelled' && oldStatus !== 'cancelled') {
            if (order.products && order.products.length > 0) {
                for (const product of order.products) {
                    await Book.findByIdAndUpdate(
                        product.productId,
                        { $inc: { stock: product.quantity } },
                        { new: true }
                    );
                    console.log(`✅ Đã hoàn trả ${product.quantity} cuốn "${product.title}" vào kho`);
                }
            }
        }

        order.status = status;
        await order.save();

        // Tạo thông báo cho user
        if (order.email) {
            try {
                const notificationData = getNotificationMessage(status, order.name || `#${order._id.toString().slice(-6)}`);
                const notification = new Notification({
                    email: order.email,
                    orderId: order._id,
                    title: notificationData.title,
                    message: notificationData.message,
                    type: notificationData.type,
                    orderStatus: status,
                    isRead: false
                });
                await notification.save();
                console.log(`✅ Đã tạo thông báo cho user ${order.email}`);
            } catch (notifError) {
                console.error('⚠️ Lỗi tạo thông báo:', notifError);
                // Không throw error, vẫn trả về success cho order update
            }
        }

        res.status(200).json({ 
            message: 'Cập nhật trạng thái đơn hàng thành công', 
            order 
        });
    } catch (error) {
        console.error('❌ Lỗi cập nhật trạng thái:', error);
        res.status(500).json({ message: error.message });
    }
};

// Bulk update order status (Admin only)
const bulkUpdateOrderStatus = async (req, res) => {
    try {
        const { orderIds, status } = req.body;

        // Kiểm tra input
        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({ message: 'Danh sách đơn hàng không hợp lệ' });
        }

        const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        const results = {
            success: [],
            failed: []
        };

        // Cập nhật từng đơn hàng
        for (const orderId of orderIds) {
            try {
                const order = await Order.findById(orderId);
                if (!order) {
                    results.failed.push({ orderId, reason: 'Không tìm thấy đơn hàng' });
                    continue;
                }

                const oldStatus = order.status;

                // Xử lý logic cộng điểm thưởng khi xác nhận đơn
                if (oldStatus === 'pending' && status === 'confirmed' && order.email) {
                    const user = await User.findOne({ email: order.email });
                    if (user && order.rewardPointsEarned > 0) {
                        const oldTier = user.tier;
                        
                        // Cộng điểm thưởng
                        user.rewardPoints = (user.rewardPoints || 0) + order.rewardPointsEarned;
                        
                        // Tự động cập nhật tier dựa trên điểm mới
                        const newTier = calculateTier(user.rewardPoints);
                        user.tier = newTier;
                        
                        await user.save();
                        console.log(`✅ Đã cộng ${order.rewardPointsEarned} điểm cho user ${order.email}`);
                        
                        // Log nếu có tier upgrade
                        if (oldTier !== newTier) {
                            console.log(`🎉 User ${order.email} đã lên hạng từ ${oldTier} lên ${newTier}!`);
                        }
                    }
                }

                // Xử lý logic hoàn trả stock khi hủy đơn
                if (status === 'cancelled' && oldStatus !== 'cancelled') {
                    if (order.products && order.products.length > 0) {
                        for (const product of order.products) {
                            await Book.findByIdAndUpdate(
                                product.productId,
                                { $inc: { stock: product.quantity } },
                                { new: true }
                            );
                        }
                    }
                }

                order.status = status;
                await order.save();
                results.success.push(orderId);

                // Tạo thông báo cho user
                if (order.email) {
                    try {
                        const notificationData = getNotificationMessage(status, order.name || `#${order._id.toString().slice(-6)}`);
                        const notification = new Notification({
                            email: order.email,
                            orderId: order._id,
                            title: notificationData.title,
                            message: notificationData.message,
                            type: notificationData.type,
                            orderStatus: status,
                            isRead: false
                        });
                        await notification.save();
                    } catch (notifError) {
                        console.error('⚠️ Lỗi tạo thông báo:', notifError);
                        // Không throw error
                    }
                }

            } catch (error) {
                results.failed.push({ orderId, reason: error.message });
            }
        }

        res.status(200).json({
            message: `Cập nhật thành công ${results.success.length}/${orderIds.length} đơn hàng`,
            results
        });

    } catch (error) {
        console.error('❌ Lỗi cập nhật hàng loạt:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAOrder,
    GetOrdersByEmail,
    updateOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    bulkUpdateOrderStatus
};