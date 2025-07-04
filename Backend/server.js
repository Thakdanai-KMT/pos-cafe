require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboard');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const app = express(); // ✅  app.use

app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/uploads', express.static('uploads'));
// ✅ Test route
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
