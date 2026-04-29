const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory-controller");

router.get("/", inventoryController.getAll);
router.post("/", inventoryController.addInventoryItem);
router.get("/:id", inventoryController.getById);
router.put("/:id", inventoryController.editById);
router.put("/:id/edit", inventoryController.editById);
router.delete("/:id", inventoryController.deleteById);

module.exports = router;
