const express = require("express");
const fs = require("fs");
const path = require("path");
const { generateToyTagData } = require('./generator/generateToyTag');

const app = express();
const PORT = 3000;

app.use(express.json());
// Serves the "public" directory as static files (so an index.html placed in ./public
// is exposed at http://localhost:3000/ and can be used as the web UI).
app.use(express.static(path.join(__dirname, "public")));

// Serve the src directory as static files
app.use('/src', express.static(path.join(__dirname, 'src')));

// Serve the data directory for sprite sheets and JSON configs
app.use('/data', express.static(path.join(__dirname, 'data')));

app.post("/generate", (req, res) => {
    const { uid, id } = req.body;

    if (!uid) {
        return res.status(400).json({ error: "UID is required." });
    }
    if (!id) {
        return res.status(400).json({ error: "ID is required." });
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
