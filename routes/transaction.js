const express = require("express");
const routes = express.Router();
const {
  createTransaction,
  transactionHistory,
  getAllClientsTotalPaidAmount
} = require("../controller/transaction");

routes.post("/", createTransaction);
routes.post("/history/:client_id", transactionHistory);
routes.get("/client", getAllClientsTotalPaidAmount);


module.exports = routes;
