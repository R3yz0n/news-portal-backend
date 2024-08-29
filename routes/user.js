const express = require("express");
const routes = express.Router();
const fileUpload = require("../utils/file_uploads");
const userController = require("../controller/user");
const {
  userValidation,
  editUserValidation,
} = require("../middlerware/user_validation");
const tokenVerification = require("../middlerware/token_verification");

routes.get("/", tokenVerification, userController.getUserController);

routes.post(
  "/",
  tokenVerification,
  fileUpload("profile_image"),
  userValidation,
  userController.createUserController
);
routes.get("/details/:id", userController.getUserDetailsController);
routes.post("/login", userController.loginController);
routes.put(
  "/:id",
  tokenVerification,
  fileUpload("profile_image"),
  editUserValidation,
  userController.editUserController
);
routes.delete("/:id", userController.deleteUser);
module.exports = routes;
