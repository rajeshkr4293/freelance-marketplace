require('dotenv').config();
const cors = require('cors');

const express = require('express');
const connectDB = require('./config/db');

// Initialize app FIRST
const app = express();

// Connect Database
//connectDB();

// Middleware
app.use(express.json());

app.use(cors());

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);



// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

const gigRoutes = require('./routes/gigRoutes');
app.use('/api/gigs', gigRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);


// Start server LAST
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

