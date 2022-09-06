const fs = require("fs");

const filePath = '../data/warehouses.json';

// function to get videos from JSON file
exports.getAll = () => {
  const warehouseArr = fs.readFileSync(filePath);
  return JSON.parse(warehouseArr);
}

// function to save video arr to JSON file
exports.saveAll = (warehouseArr) => {
  fs.writeFileSync(filePath, JSON.stringify(warehouseArr))
}



