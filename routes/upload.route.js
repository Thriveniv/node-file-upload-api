const express = require("express");
const router = express.Router();

const controller = require("../controller/fileUpload.controller");

let routes = (app) => {
  router.post("/upload-file", controller.uploadFile)
  router.post("/upload-cover", controller.coverImage)
  router.post("/create-post", controller.createPost)
  router.post("/create-md", controller.createMd)
  router.get("/files", controller.getFilesList)
  router.get("/getblogs", controller.getblogs)
  router.get("/getcontent", controller.getPostContent)
  router.get("/files/:name", controller.downloadFiles)
  router.delete("/deletepost", controller.deletePost)
  router.put("/updatepost",controller.updatePost)

  app.use(router);
};

module.exports = routes;
