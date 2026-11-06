require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const apiRouter = require("./routes");
const applicationClockHandler = require("./middlewares/applicationClockHandler");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.set("trust proxy", 1);

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:5173, http://localhost:8080, https://sikap-smkn4.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", applicationClockHandler, apiRouter);

app.get("/", (req, res) => {
  res.json({ message: "SIKAP Backend is running" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS policy violation" });
  }

  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    error: err.name || null,
  });
});

async function start() {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync();
    }
    app.listen(port, () => {
      console.log(`SIKAP backend listening on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

start();
