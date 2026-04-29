const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouse-controller");

router.get("/", warehouseController.getAll);
router.post("/", warehouseController.addWarehouse);

router.get("/:id", warehouseController.getById);
router.put("/:id", warehouseController.editById);
router.put("/:id/edit", warehouseController.editById);
router.delete("/:id", warehouseController.deleteById);

module.exports = router;
