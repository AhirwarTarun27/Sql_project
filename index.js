const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./configs/db");

db.authenticate()
  .then(() => console.log("Database is connected"))
  .catch((error) => console.log("Error", error));

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors("*"));
app.use("/", require("./routes/allRoutes"));

const PORT = process.env.PORT || 5678;

db.sync()
  .then(() =>
    app.listen(PORT, console.log(`Server is running on port ${PORT}`))
  )
  .catch((error) => console.log("Error", error));
