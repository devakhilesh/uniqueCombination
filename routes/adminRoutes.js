const express = require('express')
const { createBus, updateBus, deleteBus } = require('../controllers/busCtrl')
const { convert, busBlog } = require('../controllers/csvTojson')

const router = express.Router()

router.route("/create").post(createBus)
router.route("/update/:busId").put(updateBus)
router.route("/delete/:busId").delete(deleteBus)

// router.route("/createBusBlog/:busId").post(createBusBlog)
// router.route("/updatebusBusBlog/:blogId").put(updateBusBlog)
// router.route("/deleteBusBlog/:blogId").delete(deleteParticularBlog)
// /// get all blog list by bus Id
// router.route("/getallBlog/:busId").get(getAllBlogListOfParticularBus)


// excel
// router.route("/convert").post(convert)

// blog

// router.route("/busBlog/:busId").post(busBlog)

module.exports = router