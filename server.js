const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB подключена!"))
  .catch((err) => console.log("Ошибка:", err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/admin", require("./routes/admin"));

app.listen(process.env.PORT, () => {
  console.log(`Сервер запущен на порту ${process.env.PORT}`);
});
