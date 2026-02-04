import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { ConnectDB } from "./model/index.js";
import { PORT } from "./config/env.js";

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

ConnectDB();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api", routes);

app.listen(PORT || 3000, () => {
  console.log(`Server running at port ${PORT}`);
});
