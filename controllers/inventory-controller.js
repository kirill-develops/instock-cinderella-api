const { v4: uuidv4 } = require('uuid');
const inventoryModel = require('../model/inventory-models');

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

  console.log('Successful inventory Entry retrieved');
  res.status(200).json(inventoryEntry);
}

// Delete inventory item by ID
exports.deleteById = (req, res) => {
  const { id } = req.params;

  // Accessing inventory list
  let inventoryArray = inventoryModel.getAll();

  const findItem = inventoryArray.find(inventoryItem => inventoryItem.id === id)

  if (!findItem) {
    res.status(404).send({ message: "Item not found" })
  } else {

    // Deleting the warehouse inventory from the inventories JSON
    inventoryArray = inventoryArray.filter(inventory => inventory.id !== id)
    inventoryModel.saveAll(inventoryArray);
  }

  res.status(202).send({ message: "Item deleted successfully" })
}