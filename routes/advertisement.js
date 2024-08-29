const express = require("express");
const routes = express.Router();
const advertisementController = require("../controller/advertisement");
const tokenVerification = require("../middlerware/token_verification");
const {
  advertisementValidation,
} = require("../middlerware/advertisement_validation");

routes.get("/", advertisementController.getAdvertisementController);
routes.get(
  "/detail/:id",
  advertisementController.getAdvertisementByIdController
);
routes.put(
  "/:id",
  tokenVerification,
  advertisementValidation,
  advertisementController.editadvertisementController
);

module.exports = routes;
