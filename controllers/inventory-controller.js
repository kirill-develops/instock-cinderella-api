const { v4: uuidv4 } = require("uuid");
const inventoryModel = require("../model/inventory-models");
const warehouseModel = require("../model/warehouse-models");
const {
  hasErrors,
  isMissing,
  sendNotFound,
  sendServerError,
  sendValidationError,
} = require("./controller-utils");

const INVENTORY_VALIDATION_MESSAGE =
  "Please make sure all fields are correctly filled.";

const parseQuantity = (value) => {
  if (isMissing(value)) {
    return null;
  }

  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
};

const validateInventoryPayload = (body) => {
  const errors = {};

  if (isMissing(body.warehouseName)) errors.warehouseName = true;
  if (isMissing(body.itemName)) errors.itemName = true;
  if (isMissing(body.description)) errors.description = true;
  if (isMissing(body.category)) errors.category = true;
  if (isMissing(body.status)) errors.status = true;

  const quantity = parseQuantity(body.quantity);
  if (quantity === null) errors.quantity = true;

  return { errors, quantity };
};

const findWarehouseByName = (warehouses, warehouseName) =>
  warehouses.find((warehouse) => warehouse.name === warehouseName);

const buildInventoryItem = (id, warehouse, body, quantity) => ({
  id,
  warehouseID: warehouse.id,
  warehouseName: warehouse.name,
  itemName: body.itemName,
  description: body.description,
  category: body.category,
  status: body.status,
  quantity,
});

exports.getAll = async (_req, res) => {
  try {
    const inventory = (await inventoryModel.getAll()).map((item) => ({
      id: item.id,
      itemName: item.itemName,
      description: item.description,
      category: item.category,
      warehouseName: item.warehouseName,
      status: item.status,
      quantity: item.quantity,
    }));

    return res.status(200).json(inventory);
  } catch (error) {
    return sendServerError(res, error);
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryItem = (await inventoryModel.getAll()).find(
      (item) => item.id === id,
    );

    if (!inventoryItem) {
      return sendNotFound(res, "Item");
    }

    return res.status(200).json(inventoryItem);
  } catch (error) {
    return sendServerError(res, error);
  }
};

exports.editById = async (req, res) => {
  try {
    const { errors, quantity } = validateInventoryPayload(req.body);
    if (hasErrors(errors)) {
      return sendValidationError(res, errors, INVENTORY_VALIDATION_MESSAGE);
    }

    const { id } = req.params;
    const [inventory, warehouses] = await Promise.all([
      inventoryModel.getAll(),
      warehouseModel.getAll(),
    ]);
    const selectedWarehouse = findWarehouseByName(
      warehouses,
      req.body.warehouseName,
    );

    if (!selectedWarehouse) {
      return sendValidationError(
        res,
        { warehouseName: true },
        INVENTORY_VALIDATION_MESSAGE,
      );
    }

    const inventoryIndex = inventory.findIndex((item) => item.id === id);
    if (inventoryIndex === -1) {
      return sendNotFound(res, "Item");
    }

    const updatedInventoryItem = buildInventoryItem(
      id,
      selectedWarehouse,
      req.body,
      quantity,
    );

    inventory[inventoryIndex] = updatedInventoryItem;
    await inventoryModel.saveAll(inventory);

    return res.status(200).json(updatedInventoryItem);
  } catch (error) {
    return sendServerError(res, error);
  }
};

exports.addInventoryItem = async (req, res) => {
  try {
    const { errors, quantity } = validateInventoryPayload(req.body);
    if (hasErrors(errors)) {
      return sendValidationError(res, errors, INVENTORY_VALIDATION_MESSAGE);
    }

    const [inventory, warehouses] = await Promise.all([
      inventoryModel.getAll(),
      warehouseModel.getAll(),
    ]);
    const selectedWarehouse = findWarehouseByName(
      warehouses,
      req.body.warehouseName,
    );

    if (!selectedWarehouse) {
      return sendValidationError(
        res,
        { warehouseName: true },
        INVENTORY_VALIDATION_MESSAGE,
      );
    }

    const newInventoryItem = buildInventoryItem(
      uuidv4(),
      selectedWarehouse,
      req.body,
      quantity,
    );

    inventory.push(newInventoryItem);
    await inventoryModel.saveAll(inventory);

    return res.status(201).json({
      id: newInventoryItem.id,
      status: "successful",
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await inventoryModel.getAll();
    const inventoryIndex = inventory.findIndex((item) => item.id === id);

    if (inventoryIndex === -1) {
      return sendNotFound(res, "Item");
    }

    const updatedInventory = inventory.filter((item) => item.id !== id);
    await inventoryModel.saveAll(updatedInventory);

    return res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};
