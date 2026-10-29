
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Food from "./models/Food.js";
import foodsRouter from "./routes/foods.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CORS_ORIGIN
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins?.length ? allowedOrigins : true
}));

app.use(express.json());

// Trang chu
app.get("/", (req, res) => {
  res.json({
    message: "Food Management API",
    studentId: "236729"
  });
});

// Health Check
app.get("/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;

  res.status(connected ? 200 : 503).json({
    status: connected ? "UP" : "DOWN",
    database: connected ? "CONNECTED" : "DISCONNECTED",
    timestamp: new Date().toISOString()
  });
});

// Foods API
app.use("/api/foods", foodsRouter);

// Khong tim thay API
app.use((req, res) => {
  res.status(404).json({
    message: "API khong ton tai"
  });
});

// Xu ly JSON sai dinh dang
app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "JSON khong hop le"
    });
  }

  console.error(error);
  res.status(500).json({
    message: "Loi he thong"
  });
});

// Ket noi MongoDB truoc khi mo server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Thieu MONGODB_URI trong .env");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 10000
    });

    // Dam bao unique index foodId duoc tao
    await Food.init();

    console.log("MongoDB Atlas connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();
