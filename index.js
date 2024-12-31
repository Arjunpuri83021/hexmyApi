const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRouter = require('./router/router');
require('dotenv').config(); // Load environment variables

const app = express();

// MongoDB connection using Mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database is connected');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// CORS Configuration
const allowedOrigins = ['https://majehimaje.netlify.app', 'http://localhost:3000','https://hexmy.com','https://majehimaje.fun','https://majehimajeadmin.netlify.app','https://api.majehimaje.life'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

// Middleware to parse JSON and URL-encoded data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files from the uploads directory
app.use(express.static('./public/uploads'));

// Use your API router
app.use(apiRouter);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
