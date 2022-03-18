const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory-controller');

// GET & POST req for "/" routes
router.route('/')
  .get(inventoryController.getAll)
//   .post(inventoryController.addNew);

// GET, PUT & DELETE req for "/:id" routes of specified inventory
router.route('/:id')
  .get(inventoryController.getById)
//   .put(inventoryController.editById)
//   .delete(inventoryController.deleteById);



module.exports = router;