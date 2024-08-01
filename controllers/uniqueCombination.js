

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
     
   exports.uniqueCombination = async (req, res) => {
        const data = req.body.busStopData;
    
        if (!data || data.length === 0) {
            return res.status(400).json({ error: "No data provided" });
        }
    
        if (!Array.isArray(data) || !data.every(item => typeof item === 'string')) {
            return res.status(400).json({ error: "Invalid data format" });
        }
    
        const combinations = getCombinations(data, 2);
        res.json(combinations);
    }; 