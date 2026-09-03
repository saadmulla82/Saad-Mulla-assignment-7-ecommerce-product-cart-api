const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const logger = require('./src/middleware/logger');
const rateLimiter = require('./src/middleware/rateLimiter');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(rateLimiter);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', require('./src/routes/transactionRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// 404 Handler
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log('Server running on port ' + port);
  console.log('Swagger Docs available at http://localhost:' + port + '/api-docs');
});