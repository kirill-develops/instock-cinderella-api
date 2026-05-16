const { v4: uuidv4 } = require("uuid");
const { default: isEmail } = require("validator/lib/isEmail");
const { default: isMobilePhone } = require("validator/lib/isMobilePhone");
const warehouseModel = require("../model/warehouse-models");
const inventoryModel = require("../model/inventory-models");
const {
   hasErrors,
   isMissing,
   sendNotFound,
   sendServerError,
   sendValidationError,
} = require("./controller-utils");

const WAREHOUSE_VALIDATION_MESSAGE =
   "Please make sure all fields are correctly filled.";

const normalizeWarehousePayload = (body) => ({
   ...body,
   // Backward compatibility with older clients
   name: body.name ?? body.warehouseName,
});

const validateWarehousePayload = (body) => {
   const errors = {};
   const normalizePhone = (phone) => String(phone).replace(/[\s\-().+]/g, "");

   if (isMissing(body.name)) errors.name = true;
   if (isMissing(body.address)) errors.address = true;
   if (isMissing(body.city)) errors.city = true;
   if (isMissing(body.country)) errors.country = true;
   if (isMissing(body.contactName)) errors.contactName = true;
   if (isMissing(body.position)) errors.position = true;
   if (isMissing(body.phone) || !isMobilePhone(normalizePhone(body.phone))) {
      errors.phone = true;
   }
   if (isMissing(body.email) || !isEmail(String(body.email))) {
      errors.email = true;
   }

   return errors;
};

const buildWarehouse = (id, body) => ({
   id,
   name: body.name,
   address: body.address,
   city: body.city,
   country: body.country,
   contact: {
      name: body.contactName,
      position: body.position,
      phone: body.phone,
      email: body.email,
   },
});

exports.getAll = async (_req, res) => {
   try {
      const warehouses = (await warehouseModel.getAll()).map((warehouse) => ({
         id: warehouse.id,
         name: warehouse.name,
         address: warehouse.address,
         city: warehouse.city,
         country: warehouse.country,
         contact: warehouse.contact,
      }));

      return res.status(200).json(warehouses);
   } catch (error) {
      return sendServerError(res, error);
   }
};

exports.addWarehouse = async (req, res) => {
   try {
      const payload = normalizeWarehousePayload(req.body);
      const errors = validateWarehousePayload(payload);

      if (hasErrors(errors)) {
         return sendValidationError(res, errors, WAREHOUSE_VALIDATION_MESSAGE);
      }

      const warehouses = await warehouseModel.getAll();
      const warehouse = buildWarehouse(uuidv4(), payload);
      warehouses.push(warehouse);
      await warehouseModel.saveAll(warehouses);

      return res.status(201).json({
         id: warehouse.id,
         status: "successful",
      });
   } catch (error) {
      return sendServerError(res, error);
   }
};

exports.getById = async (req, res) => {
   try {
      const { id } = req.params;
      const [warehouses, inventoryItems] = await Promise.all([
         warehouseModel.getAll(),
         inventoryModel.getAll(),
      ]);
      const warehouse = warehouses.find((entry) => entry.id === id);

      if (!warehouse) {
         return sendNotFound(res, "Warehouse");
      }

      const inventory = inventoryItems.filter(
         (item) => item.warehouseID === id,
      );

      return res.status(200).json({
         ...warehouse,
         inventory,
      });
   } catch (error) {
      return sendServerError(res, error);
   }
};

exports.editById = async (req, res) => {
   try {
      const payload = normalizeWarehousePayload(req.body);
      const errors = validateWarehousePayload(payload);

      if (hasErrors(errors)) {
         return sendValidationError(res, errors, WAREHOUSE_VALIDATION_MESSAGE);
      }

      const { id } = req.params;
      const warehouses = await warehouseModel.getAll();
      const warehouseIndex = warehouses.findIndex(
         (warehouse) => warehouse.id === id,
      );

      if (warehouseIndex === -1) {
         return sendNotFound(res, "Warehouse");
      }

      const updatedWarehouse = buildWarehouse(id, payload);
      warehouses[warehouseIndex] = updatedWarehouse;
      await warehouseModel.saveAll(warehouses);

      return res.status(200).json(updatedWarehouse);
   } catch (error) {
      return sendServerError(res, error);
   }
};

exports.deleteById = async (req, res) => {
   try {
      const { id } = req.params;
      const [warehouses, inventoryItems] = await Promise.all([
         warehouseModel.getAll(),
         inventoryModel.getAll(),
      ]);
      const warehouseIndex = warehouses.findIndex(
         (warehouse) => warehouse.id === id,
      );

      if (warehouseIndex === -1) {
         return sendNotFound(res, "Warehouse");
      }

      const updatedWarehouses = warehouses.filter(
         (warehouse) => warehouse.id !== id,
      );
      const updatedInventory = inventoryItems.filter(
         (item) => item.warehouseID !== id,
      );

      await Promise.all([
         warehouseModel.saveAll(updatedWarehouses),
         inventoryModel.saveAll(updatedInventory),
      ]);

      return res.status(200).json({
         message: "Warehouse and its inventory items deleted successfully",
      });
   } catch (error) {
      return sendServerError(res, error);
   }
};
