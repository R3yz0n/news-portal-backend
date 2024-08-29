const express = require("express");
const routes = express.Router();
const {categoryValidation} = require("../middlerware/category_validation");

const categoryController = require("../controller/category");

const tokenVerification = require("../middlerware/token_verification");

routes.get("/", categoryController.getCategoryController);

routes.post(
  "/",
  tokenVerification,
  categoryValidation,
  categoryController.createCategoryController
);

routes.get("/:id", categoryController.getDetailsController);

routes.put(
  "/:id",
  tokenVerification,
  categoryValidation,
  categoryController.updateCategoryController
);

routes.delete("/:id", categoryController.deleteCategory);

module.exports = routes;
