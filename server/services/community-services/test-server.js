const express = require('express');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Add the alias route that we added
app.use('/auth', authRoutes);

// Add the original route for comparison
app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Test server running' });
});

app.listen(11001, '0.0.0.0', () => {
  console.log('Test server running on port 11001');
  console.log('Both /auth/login and /api/v1/auth/login should work');
});