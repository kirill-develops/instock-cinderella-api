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