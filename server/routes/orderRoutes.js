const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  createCheckoutSession,
  getFreelancerDashboard,
  getClientDashboard
} = require('../controllers/orderController');


router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.put('/:id/status', authMiddleware, updateOrderStatus);
router.post('/checkout', authMiddleware, createCheckoutSession);
// Freelancer dashboard
router.get('/dashboard/freelancer', authMiddleware, getFreelancerDashboard);
// Client dashboard
router.get('/dashboard/client', authMiddleware, getClientDashboard);



module.exports = router;
