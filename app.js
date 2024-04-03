require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");

const app = express();

const authRouter = require("./route/authRoute");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "REST API are here",
  });
});

app.use("/api/v1/auth", authRouter);

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
