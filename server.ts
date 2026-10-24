import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import uploadRouter from "./server/routes/upload.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Request logger
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    }
    next();
  });

  const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "rzp_live_Tprh049e7AQJkZ";
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "SiWqjht0zcLM0FBufp41HAM0";

  const razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });

  // API Router
  const apiRouter = express.Router();

  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  apiRouter.post("/create-razorpay-order", async (req, res) => {
    try {
      const { amount, currency, receipt } = req.body;

      if (!razorpayKeyId || !razorpayKeySecret) {
        return res.status(500).json({ error: "Razorpay keys are not configured on server" });
      }

      const options = {
        amount: Math.round(Number(amount) * 100),
        currency: currency || "INR",
        receipt: receipt || `rcpt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json({ ...order, key_id: razorpayKeyId });
    } catch (error: any) {
      console.error("Razorpay Order Error:", error);
      res.status(500).json({ error: error?.error?.description || error.message || "Failed to create Razorpay order" });
    }
  });

  app.use("/api", apiRouter);
  app.use("/api", uploadRouter);

  // Static files / Vite
  const publicPath = path.resolve(__dirname, "public");
  app.use(express.static(publicPath));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = __dirname;
    app.use(express.static(distPath));
    app.get("/{*splat}", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
