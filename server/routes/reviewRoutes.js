const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  addReview,
  getReviewsByGig
} = require('../controllers/reviewController');

// Add review (client only)
router.post('/', authMiddleware, addReview);

// Get reviews by gig (public)
router.get('/gig/:gigId', getReviewsByGig);

module.exports = router;
