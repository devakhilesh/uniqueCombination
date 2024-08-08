const express = require('express')
const { addBusImage, updateImages, getAllImages, deleteImage } = require('../controllers/busImageCtrl')

const router = express.Router() 


router.route('/upload').post(addBusImage)
router.route('/update/:busImageId').put(updateImages)
router.route('/getFilter').get(getAllImages)
router.route('/delete/:busImageId').delete(deleteImage)

module.exports = router