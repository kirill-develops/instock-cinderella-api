const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouse-controller');

// GET & POST req for "/" routes
router.route('/')
  .get(warehouseController.getAll)
  .post(warehouseController.addWarehouse);

// GET, PUT & DELETE req for "/:id" routes of specified warehouse
// router.route('/:id')
//   .get(warehouseController.getById)
//   .put(warehouseController.editById)
//   .delete(warehouseController.deleteById);


module.exports = router;