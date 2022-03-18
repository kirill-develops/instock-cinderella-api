const { v4: uuidv4 } = require('uuid');
const warehouseModel = require('../model/warehouse-models');

exports.getAll = (_req, res) => {

  // create modified array of essential info to send to client
  const warehouseArr = warehouseModel.getAll()
    .map(warehouse => {
      return {
        "id": warehouse.id,
        "name": warehouse.name,
        "address": warehouse.address,
        "city": warehouse.city,
        "country": warehouse.country,
        "contact": warehouse.contact
      }
    })
  console.log('GET "/warehouses" success');
  console.log('CLIENT_RES: warehouseArr');
  res.status(200).json(warehouseArr)
};

exports.getById = (req, res) => {

  const individualWarehouse = warehouseModel.getAll().find(
    (warehouse) => warehouse.id === req.params.id);

  // Get all inventory items for specific warehouse
  const inventoryArr = JSON.parse(fs.readFileSync(filePath))
  individualWarehouse.inventory = []
  inventoryArr.forEach(inventoryItem => {
    if (inventoryItem.warehouseID === req.params.id) {
      individualWarehouse.inventory.push(inventoryItem)
    }
  })
  console.log('Successful warehouse retrieved');
  res.status(200).json(individualWarehouse)
}


