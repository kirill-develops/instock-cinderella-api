const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "inventories.json");

exports.getAll = async () => {
  const inventoryData = await fs.readFile(filePath, "utf-8");
  return JSON.parse(inventoryData);
};

exports.saveAll = async (inventory) => {
  await fs.writeFile(filePath, JSON.stringify(inventory, null, 2));
};
