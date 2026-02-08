const Order = require('../models/Order');
const Gig = require('../models/Gig');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * CREATE ORDER (CLIENT ONLY)
 */
exports.createOrder = async (req, res) => {
  try {
    const { gigId } = req.body;

    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({ message: 'Only clients can place orders' });
    }

    const gig = await Gig.findById(gigId);

    if (!gig || !gig.isActive) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.seller.toString() === req.user.userId) {
      return res.status(400).json({ message: 'You cannot buy your own gig' });
    }

    const order = await Order.create({
      gig: gig._id,
      buyer: req.user.userId,
      seller: gig.seller,
      price: gig.price
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET ORDERS BY ROLE
 */
exports.getMyOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'CLIENT') {
      orders = await Order.find({ buyer: req.user.userId })
        .populate('gig', 'title price')
        .populate('seller', 'name email');
    } else if (req.user.role === 'FREELANCER') {
      orders = await Order.find({ seller: req.user.userId })
        .populate('gig', 'title price')
        .populate('buyer', 'name email');
    } else {
      return res.status(403).json({ message: 'Invalid role' });
    }

    res.json({ count: orders.length, orders });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * UPDATE ORDER STATUS (FREELANCER ONLY)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== 'FREELANCER') {
      return res.status(403).json({
        message: 'Only freelancers can update order status'
      });
    }

    const allowed = ['IN_PROGRESS', 'COMPLETED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.seller.toString() !== req.user.userId) {
      return res.status(403).json({
        message: 'You can update only your own orders'
      });
    }

    if (order.status === 'PENDING' && status !== 'IN_PROGRESS') {
      return res.status(400).json({ message: 'Order must be IN_PROGRESS first' });
    }

    if (order.status === 'IN_PROGRESS' && status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Order must be COMPLETED next' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * STRIPE CHECKOUT (CLIENT ONLY)
 */
exports.createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Only clients can pay
    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({
        message: 'Only clients can make payments'
      });
    }

    const order = await Order.findById(orderId).populate('gig');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    // Only buyer can pay
    if (order.buyer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: 'You can pay only for your own order'
      });
    }

    // Prevent duplicate payments
    if (order.paymentIntentId) {
      return res.status(400).json({
        message: 'Order already paid'
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: order.gig.title
            },
            unit_amount: order.price * 100
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`
    });

    order.paymentIntentId = session.payment_intent;
    await order.save();

    res.json({ url: session.url });

  } catch (error) {
      console.error('Stripe error:', error.message);
      return res.status(503).json({
        message: 'Payment service temporarily unavailable'
      });
    }

};

exports.getFreelancerDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'FREELANCER') {
      return res.status(403).json({
        message: 'Only freelancers can access this dashboard'
      });
    }

    const freelancerId = req.user.userId;
    const mongoose = require('mongoose');

    const totalOrders = await Order.countDocuments({
      seller: freelancerId
    });

    const completedOrders = await Order.countDocuments({
      seller: freelancerId,
      status: 'COMPLETED'
    });

    const earningsResult = await Order.aggregate([
      {
        $match: {
          seller: new mongoose.Types.ObjectId(freelancerId),
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

/**
 * CLIENT DASHBOARD
 */
exports.getClientDashboard = async (req, res) => {
  try {
    // Only clients allowed
    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({
        message: 'Only clients can access this dashboard'
      });
    }

    const clientId = req.user.userId;

    const totalPurchases = await Order.countDocuments({
      buyer: clientId
    });

    const completedPurchases = await Order.countDocuments({
      buyer: clientId,
      status: 'COMPLETED'
    });

    res.json({
      totalPurchases,
      completedPurchases
    });

  } catch (error) {
    console.error('Client Dashboard Error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};


