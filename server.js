const express = require("express");
const fs = require("fs");
const path = require("path");
const { generateToyTagData } = require('./generator/generateToyTag');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Test5 05/09/2025
// Serve the src directory as static files
app.use('/src', express.static(path.join(__dirname, 'src')));

app.post("/generate", (req, res) => {
    const { uid, id } = req.body;

    if (!uid || !id) {
        return res.status(400).json({ error: "UID and ID are required." });
    }

    try {
        const data = generateToyTagData(uid, id);
        res.json(data);
    } catch (error) {
        console.error("Error generating NFC lines:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Endpoint to fetch characters and vehicles
app.get('/data', (req, res) => {
    const { uid, cvid } = req.query;

    try {
        if (uid && cvid) {
            const data = generateToyTagData(uid, cvid);
            res.json(data);
        } else {
            const characters = JSON.parse(fs.readFileSync('./data/charactermap.json', 'utf8'));
            const vehicles = JSON.parse(fs.readFileSync('./data/vehiclesmap.json', 'utf8'));

            res.json({ characters, vehicles });
        }
    } catch (error) {
        console.error('Error handling /data request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
