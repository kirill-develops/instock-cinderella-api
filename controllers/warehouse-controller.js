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
  console.log('GET "/" success');
  console.log('CLIENT_RES: vidArr');
  res.status(200).json(warehouseArr)
};

// POST request for creating a new warehouse
exports.addWarehouse = (req, res) => {
  const newWarehouse = {
    id: uuidv4(),
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    contact: {
      name: req.body.name,
      position: req.body.position,
      phone: req.body.phone,
      email: req.body.email
    }
  }

  let warehouses = warehouseModel.getAll();
  warehouses.push(newWarehouse)

  warehouseModel.saveAll(warehouses);

  res.status(201).send({
    "id": newWarehouse.id,
    "status": "successful"
  })
}