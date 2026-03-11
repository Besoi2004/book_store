const express = require('express');
const router = express.Router();
const {
    getAllRanks,
    getRankById,
    getRankByPoints,
    createRank,
    updateRank,
    deleteRank,
    initializeDefaultRanks
} = require('./rank.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Public routes
router.get('/', getAllRanks);
router.get('/by-points', getRankByPoints);
router.get('/:id', getRankById);

// Admin routes
router.post('/initialize', verifyAdminToken, initializeDefaultRanks);
router.post('/', verifyAdminToken, createRank);
router.put('/:id', verifyAdminToken, updateRank);
router.delete('/:id', verifyAdminToken, deleteRank);

module.exports = router;
