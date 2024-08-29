const express = require("express");
const routes = express.Router();
const companyRoutes = require("./company");
const categoryRoutes = require("./category");
const userRoutes = require("./user");
const postRoutes = require("./post");
const clientRoutes = require("./client");
const homeRoutes = require("./home");
const advertisementRoutes = require("./advertisement");
const advertisesRoutes = require("./advertises");
const transactionRoutes = require("./transaction");
const advertiseViewRoutes = require("./advertiesview");
const tokenVerification = require("../middlerware/token_verification");
const dashboardRoutes = require("./dashboard");

routes.use("/company", companyRoutes);
routes.use("/category", categoryRoutes);
routes.use("/user", userRoutes);
routes.use("/post", postRoutes);
routes.use("/home", homeRoutes);
routes.use("/advertisement", advertisementRoutes);
routes.use("/advertises", advertisesRoutes);
routes.use("/client", clientRoutes);
routes.use("/transaction", transactionRoutes);
routes.use("/ads", advertiseViewRoutes);
routes.use("/dashboard", dashboardRoutes);

module.exports = routes;
