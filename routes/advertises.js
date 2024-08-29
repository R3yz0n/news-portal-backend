const express = require("express");
const routes = express.Router();
const fileUpload = require("../utils/file_uploads");
const {
  createAdvertisesController,
  getListAdvertisesController,
  getListAdvertisesClientController,
  updateAdvertisesController,
  getAdvertisesDetailController,
  getallAdvertiseClientController,
} = require("../controller/advertises");
const tokenVerification = require("../middlerware/token_verification");

/// for multiple image upload use true in fileUpload
routes.post(
  "/",
  tokenVerification,
  fileUpload("image"),
  createAdvertisesController
);

routes.get("/", getListAdvertisesController);
routes.put("/:id", fileUpload("image"), updateAdvertisesController);

routes.get("/client/:clientId", getListAdvertisesClientController);
routes.get("/:id", getAdvertisesDetailController);
routes.get("/list/get", getallAdvertiseClientController);

module.exports = routes;
