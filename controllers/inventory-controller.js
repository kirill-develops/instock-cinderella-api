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


//===================================================
//=============Edit Inventory Item By ID=============
//===================================================

exports.editById = (req, res) => {

  if (
    !req.body.itemName ||
    !req.body.description ||
    !req.body.category || 
    !req.body.status || 
    !req.body.warehouseName ||
    !req.body.quantity
  ) {
  return res.status(400).json({
    message: 
    "Please make sure all fields are correctly filled."
  });
}

  // Find our inventory ID in the params
const { id } = req.params; 

 // Find all the inventory
const inventories = inventoryModel.getAll(); 

  // Find the inventory to update
let updatedInventoryItem = inventories.find((item) => item.id === id);

// Update inventory item info
updatedInventoryItem = {
  id: id, 
  itemName: req.body.itemName,
  warehouseName: req.body.warehouseName,
  description: req.body.description,
  category: req.body.category, 
  status: req.body.status,
  quantity: req.body.quantity, 
}


// Find index of the warehouse in the Inventory Array to splice it out
let newInventoryItemIndex = inventories.findIndex(
  (inventory) => inventory.id === id
)

// Using the index, cut the original team from the array and replace with the updated one
inventories.splice(newInventoryItemIndex, 1, updatedInventoryItem)

// Write the file with the updated changes
inventoryModel.saveAll(inventories);
console.log(updatedInventoryItem)
// console.log(updatedInventoryItem)

// Send the response
res.status(201).json(updatedInventoryItem)
console.log('Inventory item has been updated!');


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