const fs = require("fs");

const filePath = './data/inventories.json';

// function to get videos from JSON file
exports.getAll = () => {
  const inventoryArr = fs.readFileSync(filePath);
  return JSON.parse(inventoryArr);
}

// function to save video arr to JSON file
exports.saveAll = (inventoryArr) => {
  fs.writeFileSync(filePath, JSON.stringify(inventoryArr))
}
