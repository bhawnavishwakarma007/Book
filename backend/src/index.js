import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/index.js";
import { ConnectDB } from "./model/index.js";
import { PORT } from "./config/env.js";

const app = express();

app.set("trust proxy", 1);

// ✅ FIXED CORS
const allowedOrigins = [
  "http://app-alb-2140255652.us-east-1.elb.amazonaws.com",
 // "http://localhost:8080",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / curl

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

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

app.listen(PORT || 5000, () => {
  console.log(`Server running at port ${PORT}`);
});
