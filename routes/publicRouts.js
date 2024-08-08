const express = require('express')
const { getAllBusesUser, getSingleBusUser } = require('../controllers/busCtrl')

const router = express.Router()

router.route("/getAllBus").get(getAllBusesUser)
router.route("/getSingleBus/:busId").get(getSingleBusUser)

// router.route("/").
// router.route("/").
// router.route("/").
// router.route("/").

module.exports = router