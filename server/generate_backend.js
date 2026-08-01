const fs = require('fs');
const path = require('path');

const files = {
  'config/db.js': `const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};

module.exports = connectDB;`,

  'middleware/errorMiddleware.js': `const notFound = (req, res, next) => {
  const error = new Error(\`Not Found - \${req.originalUrl}\`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };`,

  'routes/authRoutes.js': `const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => res.json({ message: 'Register route' }));
router.post('/login', (req, res) => res.json({ message: 'Login route' }));

module.exports = router;`,

  'routes/userRoutes.js': `const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => res.json({ message: 'User profile route' }));

module.exports = router;`,

  'routes/projectRoutes.js': `const express = require('express');
const router = express.Router();

router.route('/')
  .get((req, res) => res.json({ message: 'Get all projects' }))
  .post((req, res) => res.json({ message: 'Create project' }));

router.route('/:id')
  .get((req, res) => res.json({ message: 'Get project' }))
  .put((req, res) => res.json({ message: 'Update project' }))
  .delete((req, res) => res.json({ message: 'Delete project' }));

module.exports = router;`,

  'routes/resumeRoutes.js': `const express = require('express');
const router = express.Router();

router.route('/')
  .post((req, res) => res.json({ message: 'Upload resume' }))
  .get((req, res) => res.json({ message: 'Get resume details' }));

module.exports = router;`,

  'routes/interviewRoutes.js': `const express = require('express');
const router = express.Router();

router.route('/')
  .post((req, res) => res.json({ message: 'Start interview' }))
  .get((req, res) => res.json({ message: 'Get interview history' }));

module.exports = router;`,

  '.env': `NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillsync
JWT_SECRET=your_jwt_secret_key_here`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content);
}

console.log('Backend boilerplate created!');
