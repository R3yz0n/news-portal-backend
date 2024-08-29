const express = require("express");
const routes = express.Router();
const client = require("../controller/client");
const tokenVerification = require("../middlerware/token_verification");
const { clientValidation } = require("../middlerware/client_validation");

routes.post(
  "/",
  // tokenVerification,
  clientValidation,
  client.createClientController
);
routes.get(
  "/",
  // tokenVerification,
  client.getClientController
);
routes.get("/detail/:id", client.getClientDetailsController);
routes.delete("/:id", tokenVerification, client.deleteClient);
routes.put("/:id", tokenVerification, clientValidation, client.editClient);
routes.get("/list", client.getAllClientList);
module.exports = routes;
