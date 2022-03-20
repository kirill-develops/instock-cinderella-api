const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory-controller');

// GET & POST req for "/" routes
router.route('/')
  .get(inventoryController.getAll)
  .post(inventoryController.addInventoryItem);

// GET, PUT & DELETE req for "/:id" routes of specified inventory
router.route('/:id')
  .get(inventoryController.getById)
  .delete(inventoryController.deleteById);

router.route('/:id/edit')
  .put(inventoryController.editById)



module.exports = router;