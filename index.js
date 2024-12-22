const bodyParser = require('body-parser');
const express = require('express');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config(); // Load environment variables
const { swaggerUi, swaggerSpec } = require('./config/swagger');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(8081, () => console.log('Server running on http://localhost:8081/api-docs'));

// Start Server and Sync Database
sequelize.sync({ alter: true }) // Automatically update tables
  .then(() => {
    console.log('Database synced successfully');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('Database sync failed:', err));