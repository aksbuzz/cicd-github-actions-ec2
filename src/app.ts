import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import db from './db';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`Hello, World!`);
});

app.get('/users', async (req, res) => {
  try {
    const users = await db('users').select('*');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error connecting to the database');
  }
});

// Only start listening if the file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

export default app;
