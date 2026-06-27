require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const apiRouter = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.json({ message: 'SIKAP Backend is running' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error', error: err.name || null });
});

async function start() {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync();
    }
    app.listen(port, () => {
      console.log(`SIKAP backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

start();
