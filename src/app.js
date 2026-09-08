require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const instagramRoutes = require('./routes/instagramRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin,
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use('/demo', express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.json({
    message: 'Instagram Feed API is running',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      health: 'GET /',
      posts: 'GET /api/posts',
      demo: 'GET /demo/'
    }
  });
});

app.use('/api', instagramRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Instagram Feed API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Posts endpoint: http://localhost:${PORT}/api/posts`);
  console.log(`Demo website: http://localhost:${PORT}/demo/`);
});

module.exports = app;
