const express = require("express");
const routes = express.Router();
const dashboardController = require("../controller/dashboard");
const tokenVerification = require("../middlerware/token_verification");

routes.get("/", dashboardController.getAllInformationController);

module.exports = routes;
