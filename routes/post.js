const express = require("express");
const routes = express.Router();
const uploadFile = require("../utils/file_uploads");
const postController = require("../controller/post");
const {postValidation} = require("../middlerware/post_validation");
const tokenVerification = require("../middlerware/token_verification");

routes.get("/", postController.getPostController);

routes.post(
  "/",
  tokenVerification,
  uploadFile("featured_image"),
  postValidation,
  postController.createPostController
);
routes.get("/:slug", postController.categoryPostController);
routes.put(
  "/:id",
  tokenVerification,
  uploadFile("featured_image"),
  postValidation,
  postController.editPostController
);

routes.get("/detail/:id", postController.detailPostController);

routes.delete("/:id", postController.deletePost);

module.exports = routes;
