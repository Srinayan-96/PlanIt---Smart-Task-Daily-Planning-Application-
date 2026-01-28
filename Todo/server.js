const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//error handler
const errorHandler = require("./middleware/errorHandler");

//attach routes
const taskRoutes = require("./routes/taskRoutes.js");
app.use("/api/tasks", taskRoutes);


//404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//global error handler LAST
app.use(errorHandler);

connectDB();

app.listen(3000, () => {
  console.log("Server is running on 3000");
});

