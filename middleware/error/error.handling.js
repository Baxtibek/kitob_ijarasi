const ApiError = require("../../helpers/api.error");
const logger = require("../../services/logger.service");

module.exports = function (err, req, res, next) {
  logger.error("Error occurred:", err);

  if (err instanceof ApiError) {
    logger.warn("Handled ApiError:", err.message);
    return res.status(err.status).json(err.toJson());
  }

  if (err instanceof SyntaxError) {
    logger.warn("SyntaxError in request:", err.message);
    return res.status(400).json({ message: err.message });
  }

  logger.error("Unhandled Error:", err.message);
  return res.status(500).json(ApiError.internal("Something went wrong"));
};
