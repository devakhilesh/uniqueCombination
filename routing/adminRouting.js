const express = require('express')

const admin = express()

const adminRoute = require("../routes/adminRoutes")

admin.use("/admin/bus", adminRoute)


module.exports = admin