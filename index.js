const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const path = require('path');
const fs = require('fs');
app.use(express.json());

app.use(cors())
const busStopData = [
"Babarpur Extension",
"Mauzpur",
"Zafarabad School",
"Eidgah",
"Police Station Zafarabad",
"Seelampur",
"Parsvnath Metro Mall-Seelampur",
"Seelampur Metro Station",
"Dharam Pura",
"Shastri Park",
"Shri Shyam Girimath Mandir",
"Shastri Park Metro Depot",
"Nityanand Marg",
"Tis Hazari Court",
"Saint Stephens Hospital",
"Baraf Khana",
"Azad Market / DCM",
"Bara Hindu Rao",
"Filmistan",
"Model Basti",
"Idgah",
"Guru Govind Singh Crossing",
"Faiz Road",
"Prahlad Market",
"Khalsa College",
"Regharpura",
"R.S. Satsang",
"Rajendra Place",
"East Patel Nagar",
"Patel Nagar Metro Station",
"West Patel Nagar",
"Shadipur Metro Station",
"Shadipur Depot"
];
 

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

// API endpoint to get combinations
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


