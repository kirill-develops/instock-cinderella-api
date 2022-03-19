const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const { default: isEmail } = require('validator/lib/isEmail');
const { default: isMobilePhone } = require('validator/lib/isMobilePhone');
const warehouseModel = require('../model/warehouse-models');
const inventoryModel = require('../model/inventory-models');
// const fs = require("fs");


const filePath = './data/inventories.json';

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
  console.log(isEmailValid);
  if (!isEmailValid) {
    errorCount += 1;
    errors.email = true;
  }

  return {
    errorCount,
    errors,
  };
};

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
        email: req.body.email,
      },
    };

    let warehouses = warehouseModel.getAll();
    warehouses.push(newWarehouse);

    warehouseModel.saveAll(warehouses);

    res.status(201).send({
      result: result,
      id: newWarehouse.id,
      status: "successful",
    });
  }
  res.send({
    result: result,
    status: "unsuccessful",
  });
};

exports.getById = (req, res) => {
  const individualWarehouse = warehouseModel
    .getAll()
    .find((warehouse) => warehouse.id === req.params.id);

  // Get all inventory items for specific warehouse
  const inventoryArr = JSON.parse(fs.readFileSync(filePath));
  individualWarehouse.inventory = [];
  inventoryArr.forEach((inventoryItem) => {
    if (inventoryItem.warehouseID === req.params.id) {
      individualWarehouse.inventory.push(inventoryItem);
    }
  });
  res.status(200).json(individualWarehouse);
};

console.log("Successful warehouse retrieved");

exports.editById = (req, res) => {
  // Add some validatoin. Requires fields: name, street address, city, country, contact name, position, phone, email.
  console.log(req.body)
  if (
    !req.body.name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contactName ||
    !req.body.position ||
    !req.body.phone ||
    !req.body.email
  ) {
    return res.status(400).json({
      message:
        "The folliwng fields cannot be empty: warehouse name, adress, city, country, contact name, contact position, contact phone and contact email.",
    });
  }

  // Find our warehouse ID in the params
  const { id } = req.params;

  // Find all the warehouses
  const warehouses = warehouseModel.getAll()

  // Find the warehouse to update
  let updatedWarehouse = warehouses.find((warehouse) => warehouse.id === id);

  // Update info
  updatedWarehouse = {
    id: id,
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    contact: 
      {
        name: req.body.contactName,
        position: req.body.position,
        phone: req.body.phone,
        email: req.body.email,
      }
  };
  //find index of the warehouse
  let newWarehouseIndex = warehouses.findIndex(
    (warehouse) => warehouse.id === id
  );

  //using the index, cut the original team from the array and replace with the updated one
  warehouses.splice(newWarehouseIndex, 1, updatedWarehouse);

  //write the file with the updated team changes
  warehouseModel.saveAll(warehouses);

  //send the response
  res.status(201).json(updatedWarehouse);
};

// Delete warehouse by ID
exports.deleteById = (req, res) => {
  const { id } = req.params;
  
  // Accessing warehouse list
  let warehouseArray = warehouseModel.getAll();
  // Accessing inventory list
  let inventoryArray = inventoryModel.getAll();
  
  const findWarehouse = warehouseArray.find(warehouse => warehouse.id === id)
  
  if (!findWarehouse) {
    res.status(404).send({ message: "Warehouse not found" })  
  } else {
    
    // Deleting warehouse details from the warehouses JSON
    warehouseArray = warehouseArray.filter(warehouse => warehouse.id !== id)
    warehouseModel.saveAll(warehouseArray);
    
    // Deleting the warehouse inventory from the inventories JSON
    inventoryArray = inventoryArray.filter(inventory => inventory.warehouseID !== id)
    inventoryModel.saveAll(inventoryArray);
    }

    res.status(202).send({message: "Warehouse and it's inventory items deleted successfully"})
  }


