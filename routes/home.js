const express = require("express");
const routes = express.Router();
const home = require("../controller/home")


routes.get('/',home.homePagePost)

module.exports = routes;