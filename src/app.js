// app.js
const express = require('express');
const dotenv = require('dotenv');
const verifyToken = require('./middleware/auth');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// root
app.get('/', (req, res) => {
  res.send('you are connected!!');
});

// Import routes
const authRoutes = require('./api/auth/authRoutes');
const userRoutes = require('./api/users/userRoutes');
const userProgramRoutes = require('./api/userprogram/userProgramRoutes');
const mealHistoryRoutes = require('./api/mealhistory/mealHistoryRoutes');
const historyRoutes = require('./api//history/historyRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/userprogram', userProgramRoutes);
app.use('/api/mealhistory', mealHistoryRoutes);
app.use('/api/history', historyRoutes);

// GET /protected (protected route)
app.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: `Hello, user with ID: ${req.user.userId}! You have accessed a protected route.`,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
