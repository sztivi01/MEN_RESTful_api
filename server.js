const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const keyboards = require("./models/keyboards");
const app = express();
const { verifyToken } = require("./validation");

//swagger stuff
const swaggerUI = require("swagger-ui-express");
const yaml = require("yamljs");

//setup
const swaggerDefinition = yaml.load("swagger.yaml");
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDefinition));

//import routes
const keyboardsRoutes = require("./routes/keyboards");
const authRoutes = require("./routes/auth");

require("dotenv-flow").config();

//parse request of content type JSON
app.use(bodyParser.json());

mongoose
  .connect(process.env.DBHOST, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .catch((error) => console.log("Error connecting to mongoDB" + error));

mongoose.connection.once("open", () =>
  console.log("Connected succesfully to MONGOdb")
);

//routes
app.get("/api/welcome", (req, res) => {
  res.status(200).send({ message: "welcome to the MEN RESTful API" });
});

//post,put,delete ->CRUD

app.use("/api/keyboards", keyboardsRoutes);
app.use("/api/user", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
  console.log("Server is running on port: " + PORT);
});

module.exports = app;
