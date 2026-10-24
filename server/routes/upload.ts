import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { adminMiddleware } from "./auth.js";

const uploadRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit before strict validation
  },
});

// Helper to check actual decoded image content via magic bytes
function isValidImageBuffer(buffer: Buffer): { valid: boolean; ext?: string } {
  if (!buffer || buffer.length < 12) return { valid: false };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: "jpg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, ext: "png" };
  }

  // WebP: RIFF ... WEBPVP
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { valid: true, ext: "webp" };
  }

  return { valid: false };
}

uploadRouter.post(
  "/upload",
  adminMiddleware,
  upload.array("images", 8),
  async (req: Request, res: Response) => {
    const uploadedFiles: string[] = [];
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No image files uploaded" });
      }

      if (files.length > 8) {
        return res.status(400).json({ error: "Maximum 8 images allowed per product" });
      }

      const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      for (const file of files) {
        // Max decoded size 2MB
        if (file.size > 2 * 1024 * 1024) {
          // Clean up partials
          for (const fPath of uploadedFiles) {
            await fs.unlink(path.resolve(process.cwd(), "public", fPath.replace(/^\//, ""))).catch(() => {});
          }
          return res.status(413).json({ error: `File ${file.originalname} exceeds 2MB limit` });
        }

        const check = isValidImageBuffer(file.buffer);
        if (!check.valid || !check.ext) {
          for (const fPath of uploadedFiles) {
            await fs.unlink(path.resolve(process.cwd(), "public", fPath.replace(/^\//, ""))).catch(() => {});
          }
          return res.status(400).json({ error: `Invalid image content or unsupported format for ${file.originalname}. Only JPEG, PNG and WebP are allowed.` });
        }

        const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${check.ext}`;
        const relativePath = `/uploads/${fileName}`;
        const absolutePath = path.join(uploadsDir, fileName);

        await fs.writeFile(absolutePath, file.buffer);
        uploadedFiles.push(relativePath);
      }

      return res.json({ urls: uploadedFiles });
    } catch (error: any) {
      console.error("Upload error:", error);
      for (const fPath of uploadedFiles) {
        await fs.unlink(path.resolve(process.cwd(), "public", fPath.replace(/^\//, ""))).catch(() => {});
      }
      return res.status(500).json({ error: error.message || "Failed to upload images" });
    }
  }
);

export default uploadRouter;
