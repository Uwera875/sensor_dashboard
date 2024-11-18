require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Store last 100 readings (you can adjust this)
const readings = [];
const MAX_READINGS = 100;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Endpoint to receive sensor data
app.post('/api/data', (req, res) => {
    const reading = {
        value: req.body.sensor,
        timestamp: new Date(),
    };
    
    readings.push(reading);
    if (readings.length > MAX_READINGS) {
        readings.shift(); // Remove oldest reading
    }
    
    console.log('Received sensor data:', reading);
    res.status(200).json({ message: 'Data received successfully' });
});

// Serve the dashboard page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// API to get readings
app.get('/api/readings', (req, res) => {
    res.json(readings);
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});