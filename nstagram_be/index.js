const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create a Redis client
const redisClient = redis.createClient({
    host: '127.0.0.1', // Redis server hostname
    port: 6379        // Redis server port
});

redisClient.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});

// Endpoint to receive NFC data
app.post('/nfcdata', (req, res) => {
    const nfcData = req.body.data;
    console.log('Received NFC Data:', nfcData);
    
    // Save nfcData to Redis with a unique key (e.g., timestamp)
    const key = `nfcdata:${Date.now()}`;
    redisClient.set(key, nfcData, (err, reply) => {
        if (err) {
            console.error('Error saving data to Redis:', err);
            return res.sendStatus(500);
        }
        console.log('Data saved to Redis:', reply);
        res.sendStatus(200);
    });
});
app.get("/healthcheck", (req, res) => {
    const status = 200; 
    res.status(status).send(`Healthy: ${status}`);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});