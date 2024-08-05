const express = require('express')
const { getSingleBus, getAllBuses } = require('../controllers/busCtrl')

const router = express.Router()

router.route("/getAllBus").get(getAllBuses)
router.route("/getSingleBus/:busId").get(getSingleBus)

// router.route("/").
// router.route("/").
// router.route("/").
// router.route("/").

module.exports = router