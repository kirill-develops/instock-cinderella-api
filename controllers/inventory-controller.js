const { v4: uuidv4 } = require('uuid');
const inventoryModel = require('../model/inventory-models');
const warehouseModel = require('../model/warehouse-models');

exports.getAll = (_req, res) => {

  // create modified array of essential info to send to client
  const inventoryArr = inventoryModel.getAll()
    .map(item => {
      return {
        "id": item.id,
        "itemName": item.itemName,
        "description": item.description,
        "category": item.category,
        "warehouseName": item.warehouseName,
        "status": item.status,
        "quantity": item.quantity
      }
    })
  res.status(200).json(inventoryArr);
};

exports.getById = (req, res) => {

  const inventoryEntry = inventoryModel.getAll()
    .find((item) => item.id === req.params.id);

  res.status(200).json(inventoryEntry);
}

// POST request for creating a new Inventory Item
exports.addInventoryItem = (req, res) => {

  // required warehouse ID
  const getID = (req) => {
    
    let selectedWarehouseName = req.body.warehouseName;
    
    // access the warehouse array
    let warehouses = warehouseModel.getAll();

    // find the selected warehouse name from the warehouse array 
    let selectedWarehouse = warehouses.find(warehouse => warehouse.name === selectedWarehouseName);

    return selectedWarehouse.id;
  }

  if (
    !req.body.warehouseName ||
    !req.body.itemName ||
    !req.body.description ||
    !req.body.category ||
    !req.body.status
  ) {
    return res.status(400).send("Fields cannot be empty");

  } else {

    const newInventoryItem = {
      id: uuidv4(),
      warehouseID: getID(req),
      warehouseName: req.body.warehouseName,
      itemName: req.body.itemName,
      description: req.body.description,
      category: req.body.category,
      status: req.body.status,
      quantity: req.body.quantity
    }

    let inventoryArray = inventoryModel.getAll();
    inventoryArray.push(newInventoryItem);

    inventoryModel.saveAll(inventoryArray);

    res.status(201).json({
      id: newInventoryItem.id,
      status: "successful",
    });
  }
}

// Delete inventory item by ID
exports.deleteById = (req, res) => {
  const { id } = req.params;

  // Accessing inventory list
  let inventoryArray = inventoryModel.getAll();

  const findItem = inventoryArray.find(inventoryItem => inventoryItem.id === id)

  if (!findItem) {
    res.status(404).send("Item not found")
  } else {

    // Deleting the warehouse inventory from the inventories JSON
    inventoryArray = inventoryArray.filter(inventory => inventory.id !== id)
    inventoryModel.saveAll(inventoryArray);
  }

  res.status(202).send("Item deleted successfully")
}