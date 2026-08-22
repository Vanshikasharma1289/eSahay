// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const dotenv = require('dotenv');

// // Load environment variables
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// console.log('[eSahay Config Check]: JWT_SECRET is ->', process.env.JWT_SECRET ? 'Loaded' : 'MISSING');
// console.log('[eSahay Config Check]: GEMINI_API_KEY is ->', process.env.GEMINI_API_KEY ? 'Loaded' : 'MISSING');

// // Connect to Database
// const connectDB = require('./config/db');
// connectDB();

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));

// app.get('/api/health', (req, res) => {
//   res.json({ status: 'active', app: 'eSahay Backend' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`[eSahay Backend] Server running on port ${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// 1. Explicitly load .env from the server root directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

// 2. Connect to Database
const connectDB = require('./config/db');
connectDB();

const app = express();

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));

// 5. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', app: 'eSahay Backend' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[eSahay Backend] Server running on port ${PORT}`);
});