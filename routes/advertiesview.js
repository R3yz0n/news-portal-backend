const express = require("express");
const routes = express.Router();
const advertiseViewController = require("../controller/advertiseview");

routes.get("/homepage", advertiseViewController.homePageAdvertise);
routes.get(
  "/category/:category_slug",
  advertiseViewController.specificCategoryAdversties
);
routes.get("/post/details", advertiseViewController.postDetailsAdverstises);

module.exports = routes;
