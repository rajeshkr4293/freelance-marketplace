const Review = require('../models/Review');
const Order = require('../models/Order');

/**
 * ADD REVIEW (CLIENT ONLY, COMPLETED ORDER)
 */
exports.addReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    // Only clients can review
    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({
        message: 'Only clients can add reviews'
      });
    }

    // Basic validation
    if (!orderId || !rating) {
      return res.status(400).json({
        message: 'Order ID and rating are required'
      });
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    // Check order ownership
    if (order.buyer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: 'You can review only your own orders'
      });
    }

    // Order must be completed
    if (order.status !== 'COMPLETED') {
      return res.status(400).json({
        message: 'You can review only completed orders'
      });
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({ order: orderId });
    if (existingReview) {
      return res.status(400).json({
        message: 'Review already submitted for this order'
      });
    }

    // Create review
    const review = await Review.create({
      gig: order.gig,
      order: order._id,
      reviewer: req.user.userId,
      seller: order.seller,
      rating,
      comment
    });

    res.status(201).json({
      message: 'Review added successfully',
      review
    });

  } catch (error) {
    console.error('Add Review Error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};


/**
 * GET REVIEWS BY GIG (PUBLIC)
 */
exports.getReviewsByGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const reviews = await Review.find({ gig: gigId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });

    res.json({
      count: reviews.length,
      reviews
    });

  } catch (error) {
    console.error('Get Reviews Error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * FREELANCER DASHBOARD
 */
exports.getFreelancerDashboard = async (req, res) => {
  try {
    // Only freelancers allowed
    if (req.user.role !== 'FREELANCER') {
      return res.status(403).json({
        message: 'Only freelancers can access this dashboard'
      });
    }

    const freelancerId = req.user.userId;

    // Total orders
    const totalOrders = await Order.countDocuments({
      seller: freelancerId
    });

    // Completed orders
    const completedOrders = await Order.countDocuments({
      seller: freelancerId,
      status: 'COMPLETED'
    });

    // Total earnings (only completed)
    const earningsResult = await Order.aggregate([
      {
        $match: {
          seller: new require('mongoose').Types.ObjectId(freelancerId),
          status: 'COMPLETED'
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$price' }
        }
      }
    ]);

    const totalEarnings =
      earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;

    res.json({
      totalOrders,
      completedOrders,
      totalEarnings
    });

  } catch (error) {
    console.error('Freelancer Dashboard Error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};
