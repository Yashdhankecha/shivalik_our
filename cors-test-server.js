const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 11001;

// CORS configuration
var whitelist = [
    'localhost:11001',
    'localhost:5173',  // Vite default port
    'localhost:8080',  // Vite dev server port
    'localhost:3000',  // React default port
];

var corsOption = function (req, callback) {
    var corsOptions;
    // Get the origin header for CORS requests
    const origin = req.header('origin');
    
    // Check if origin is in whitelist or if it's a same-origin request
    if (!origin || whitelist.some(allowedOrigin => origin.includes(allowedOrigin))) {
        corsOptions = { 
            origin: true, 
            credentials: true,
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        };
        callback(null, corsOptions);
    } else {
        corsOptions = { origin: false };
        callback(null, corsOptions);
    }
};

app.use(cors(corsOption));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CORS Test server running' });
});

app.post('/auth/login', (req, res) => {
  res.json({ message: 'Auth login endpoint working', result: { accessToken: 'test-token', refreshToken: 'test-refresh' } });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CORS Test server running on http://localhost:${PORT}`);
});