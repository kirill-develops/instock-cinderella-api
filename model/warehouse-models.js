const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "warehouses.json");

exports.getAll = async () => {
  const warehouseData = await fs.readFile(filePath, "utf-8");
  return JSON.parse(warehouseData);
};

exports.saveAll = async (warehouses) => {
  await fs.writeFile(filePath, JSON.stringify(warehouses, null, 2));
};
