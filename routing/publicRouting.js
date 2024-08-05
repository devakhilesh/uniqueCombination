const express = require('express');
const busPublic = express()


const busPublicRoute = require('../routes/publicRouts')

busPublic.use('/public/bus', busPublicRoute)

module.exports = busPublic