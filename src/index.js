import cookieParser from "cookie-parser";
import express from "express";
import routes from "./routes/index.js";
import { ConnectDB } from "./model/index.js";
import { PORT } from "./config/env.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

ConnectDB();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api", routes);

app.listen(PORT || 3000, () => {
  console.log(`Server running at port ${PORT}`);
});
