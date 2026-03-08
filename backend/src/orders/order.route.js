const express = require('express');
const { createAOrder,GetOrdersByEmail } = require('./order.controller');

const router = express.Router();
// create order
router.post('/', createAOrder);

//get orders by user email
router.get("/email/:email", GetOrdersByEmail); 

module.exports = router;