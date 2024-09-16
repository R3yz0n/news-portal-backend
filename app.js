const express = require("express");
const dot = require("dotenv");
const cors = require("cors");
dot.config();
const app = express();
const port = process.env.PORT || 8080;
require("./utils/update_Adverties_status");
const fileUpload = require('express-fileupload');


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const apiRoutes = require("./routes/index");

app.use(cors());
app.use(fileUpload({
  useTempFiles: true, // This will allow you to use `tempFilePath`
  tempFileDir: '/tmp/' // You can set this to any temp directory
}));
// app.use("/static", express.static(__dirname + "/public"));

app.get("/", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "News_portal",
  });
});
app.use("/api", apiRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
