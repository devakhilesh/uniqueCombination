const express = require('express');
const { uniqueCombination } = require('../controllers/uniqueCombination');

const router = express.Router();


router.route("/combinations").post(uniqueCombination)



module.exports = router 