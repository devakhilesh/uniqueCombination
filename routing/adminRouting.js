const express = require('express')

const admin = express()

const adminRoute = require("../routes/adminRoutes")
const adminBusImage = require("../routes/busImageRoute")

admin.use("/admin/bus/images", adminBusImage)

admin.use("/admin/bus", adminRoute)


module.exports = admin