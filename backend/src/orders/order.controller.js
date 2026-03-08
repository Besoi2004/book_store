const Order = require('./order.model');

const createAOrder = async (req, res) => {
    try {
        const newOrder = await Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);

    } catch (error) {
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

module.exports = {
    createAOrder,
    GetOrdersByEmail
};