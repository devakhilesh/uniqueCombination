const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');
app.use(express.json());

app.use(cors())

app.use(fileUpload());

const admin = require("./routing/adminRouting")
app.get("/", async (req, res) => {
  return res.sendFile(path.join(__dirname,"index.html"))
})

function getCombinations(array, size) {
function* combinations(source, combo = []) {
        if (combo.length === size) {
            yield combo;
            return;
        }
        for (let i = 0; i < source.length; i++) {
            yield* combinations(source.slice(i + 1), [...combo, source[i]]);
        }
    }
    return Array.from(combinations(array));
}

app.post('/combinations', (req, res) => {
    const data = req.body.busStopData;

    if (!data || data.length === 0) {
        return res.status(400).json({ error: "No data provided" });
    }

    if (!Array.isArray(data) || !data.every(item => typeof item === 'string')) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    const combinations = getCombinations(data, 2);
    res.json(combinations);
});

 app.use("/", admin)



module.exports = app


