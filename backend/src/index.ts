import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = parseInt(process.env.PORT || '3001', 10);

app.listen(PORT, () => {
  console.log(`[pyra-wood] Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
