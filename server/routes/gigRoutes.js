const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createGig,
  getAllGigs,
  getGigById,
  updateGig,
  deleteGig
} = require('../controllers/gigController');

// Public routes
router.get('/', getAllGigs);
router.get('/:id', getGigById);

// Protected routes
router.post('/', authMiddleware, createGig);
router.put('/:id', authMiddleware, updateGig);
router.delete('/:id', authMiddleware, deleteGig);

module.exports = router;
