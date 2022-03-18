const { v4: uuidv4 } = require('uuid');
const { default: isEmail } = require('validator/lib/isEmail');
const { default: isMobilePhone } = require('validator/lib/isMobilePhone');
const warehouseModel = require('../model/warehouse-models');
const inventoryModel = require('../model/inventory-models');
// const fs = require("fs");


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

// Form validation
const validate = (req) => {

  let errorCount = 0;
  let errors = {};

  if (!req.body.name) {
    errorCount += 1;
    errors.name = true; 
  }
  if (!req.body.address) {
    errorCount += 1;
    errors.address = true;
  }
  if (!req.body.city) {
    errorCount += 1;
    errors.city = true;
  }
  if (!req.body.country) {
    errorCount += 1;
    errors.country = true;
  }
  if (!req.body.contactName) {
    errorCount += 1;
    errors.contactName = true;
  }
  if (!req.body.position) {
    errorCount += 1;
    errors.position = true;
  }
  
  const isPhoneValid = isMobilePhone(req.body.phone, ['en-CA']);
  console.log(isPhoneValid)
  if (!isPhoneValid) {
    errorCount += 1;
    errors.phone = true;
  }

  const isEmailValid = isEmail(req.body.email);
  console.log(isEmailValid)
  if (!isEmailValid) {
    errorCount += 1;
    errors.email = true;
  }

  return {
    errorCount, errors
  }
}

// POST request for creating a new warehouse
exports.addWarehouse = (req, res) => {
  
  const result = validate(req);
  console.log(result);
  if (result.errorCount === 0) {

    const newWarehouse = {
      id: uuidv4(),
      name: req.body.warehouseName,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      contact: {
        name: req.body.contactName,
        position: req.body.position,
        phone: req.body.phone,
        email: req.body.email
      }
    }

    let warehouses = warehouseModel.getAll();
    warehouses.push(newWarehouse)

    warehouseModel.saveAll(warehouses);

    res.status(201).send({
      "result": result,
      "id": newWarehouse.id,
      "status": "successful"
    })
  }
  res.send({
    "result": result,
    "status": "unsuccessful"
  })
}

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


// Delete warehouse by ID
exports.deleteById = (req, res) => {
  const { id } = req.params;
  
  // Accessing warehouse list
  let warehouseArray = warehouseModel.getAll();
  // Accessing inventory list
  let inventoryArray = inventoryModel.getAll();
  
  const deleted = warehouseArray.find(warehouse => warehouse.id === id)
  
  if (!deleted) {
    res.status(404).send({ message: "Warehouse not found" })  
  } else {
    
    // Deleting warehouse details from the warehouses JSON
    warehouseArray = warehouseArray.filter(warehouse => warehouse.id !== id)
    warehouseModel.saveAll(warehouseArray);
    
    // Deleting the warehouse inventory from the inventories JSON
    inventoryArray = inventoryArray.filter(inventory => inventory.warehouseID !== id)
    inventoryModel.saveAll(inventoryArray);
    }

    res.status(202).send({message: "Warehouse and it's inventory deleted successfully"})
  }
