const express = require('express');

const app = express();
const PORT = 11001;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Test server running' });
});

app.get('/auth/login', (req, res) => {
  res.json({ message: 'Auth login endpoint working' });
});

app.post('/auth/login', (req, res) => {
  res.json({ message: 'Auth login endpoint working', result: { accessToken: 'test-token', refreshToken: 'test-refresh' } });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});