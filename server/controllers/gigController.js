const Gig = require('../models/Gig');

/**
 * CREATE GIG (FREELANCER ONLY)
 */
exports.createGig = async (req, res) => {
  try {
    if (req.user.role !== 'FREELANCER') {
      return res.status(403).json({
        message: 'Only freelancers can create gigs'
      });
    }

    const {
      title,
      description,
      price,
      category,
      deliveryTime,
      images
    } = req.body;

    if (!title || !description || !price || !category || !deliveryTime) {
      return res.status(400).json({
        message: 'All required fields must be provided'
      });
    }

    const gig = await Gig.create({
      title,
      description,
      price,
      category,
      deliveryTime,
      images,
      seller: req.user.userId
    });

    res.status(201).json({
      message: 'Gig created successfully',
      gig
    });

  } catch (error) {
    console.error('Create Gig Error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * GET ALL GIGS (PUBLIC)
 */
exports.getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ isActive: true })
      .populate('seller', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      count: gigs.length,
      gigs
    });
  } catch (error) {
    console.error('Get Gigs Error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * GET SINGLE GIG BY ID (PUBLIC)
 */
exports.getGigById = async (req, res) => {
  try {
    const { id } = req.params;

    const gig = await Gig.findById(id)
      .populate('seller', 'name email role');

    if (!gig || !gig.isActive) {
      return res.status(404).json({
        message: 'Gig not found'
      });
    }

    res.json(gig);

  } catch (error) {
    console.error('Get Gig By ID Error:', error);

    // Invalid MongoDB ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid gig ID'
      });
    }

    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * UPDATE GIG (FREELANCER + OWNER ONLY)
 */
exports.updateGig = async (req, res) => {
  try {
    const { id } = req.params;

    // Only freelancers allowed
    if (req.user.role !== 'FREELANCER') {
      return res.status(403).json({
        message: 'Only freelancers can update gigs'
      });
    }

    const gig = await Gig.findById(id);

    if (!gig || !gig.isActive) {
      return res.status(404).json({
        message: 'Gig not found'
      });
    }

    // Ownership check
    if (gig.seller.toString() !== req.user.userId) {
      return res.status(403).json({
        message: 'You can update only your own gig'
      });
    }

    const updatedGig = await Gig.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      message: 'Gig updated successfully',
      gig: updatedGig
    });

  } catch (error) {
    console.error('Update Gig Error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid gig ID'
      });
    }

    res.status(500).json({
      message: 'Internal server error'
    });
  }
};


/**
 * DEACTIVATE GIG (SOFT DELETE)
 */
exports.deleteGig = async (req, res) => {
  try {
    const { id } = req.params;

    // Only freelancers allowed
    if (req.user.role !== 'FREELANCER') {
      return res.status(403).json({
        message: 'Only freelancers can delete gigs'
      });
    }

    const gig = await Gig.findById(id);

    if (!gig || !gig.isActive) {
      return res.status(404).json({
        message: 'Gig not found'
      });
    }

    // Ownership check
    if (gig.seller.toString() !== req.user.userId) {
      return res.status(403).json({
        message: 'You can delete only your own gig'
      });
    }

    gig.isActive = false;
    await gig.save();

    res.json({
      message: 'Gig deactivated successfully'
    });

  } catch (error) {
    console.error('Delete Gig Error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid gig ID'
      });
    }

    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

