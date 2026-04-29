const isMissing = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && value.trim() === "");

const hasErrors = (errors) => Object.keys(errors).length > 0;

const sendValidationError = (
  res,
  errors,
  message = "Please make sure all fields are correctly filled.",
) => {
  return res.status(400).json({
    message,
    errors,
  });
};

const sendNotFound = (res, entity) => {
  return res.status(404).json({ message: `${entity} not found` });
};

const sendServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

module.exports = {
  hasErrors,
  isMissing,
  sendNotFound,
  sendServerError,
  sendValidationError,
};
