const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
const apiRoutes = require("./routes/apiRoutes");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Api is running..." });
});

app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log("Server Is Running ✅");
});

// Connect to database
const connectDB = require("./config/db");
connectDB();
