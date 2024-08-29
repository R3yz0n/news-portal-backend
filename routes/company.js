const express = require("express");
const routes = express.Router();
const uploadFile = require("../utils/file_uploads");
const companyController = require("../controller/company");
const { companyValidation } = require("../middlerware/company_validation ");
const tokenVerification = require("../middlerware/token_verification");

routes.get("/", companyController.getCompanyController);

routes.post(
  "/",
  tokenVerification,
  uploadFile("logo"),
  companyValidation,
  companyController.createCompanyController
);
routes.delete("/:id", tokenVerification, companyController.deleteCompany);
routes.put("/:id", 
tokenVerification,
uploadFile("logo"),
companyValidation,
companyController.editCompany);

module.exports = routes;
