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


