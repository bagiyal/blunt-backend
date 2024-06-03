require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const cors = require("cors");

const app = express();

const authRouter = require("./route/authRoute");
const categories = require("./route/categoryRoute");
const news = require("./route/newsRoute");
const imageRoutes = require("./route/imageRoutes");
const notificationRoute = require("./route/sendNotificationRoute");
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "REST API are here",
  });
});

app.use("/api/v1", authRouter);
app.use("/api/v1", categories);
app.use("/api/v1", news);
app.use("/api/v1", imageRoutes);
app.use("/api/v1", notificationRoute);
// Serve static files from the 'uploads' directory
app.use("/uploads", express.static("/root/blunt-backend/uploads"));

app.use("*", (req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Invalid Route",
  });
});

const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
