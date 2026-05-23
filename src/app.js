const cookieParser = require('cookie-parser');
const express = require('express');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).send('<h1>Hello from Node JS server</h1>');
});

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;
