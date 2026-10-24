import { Request, Response, NextFunction } from "express";

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  // Simple check or token verification for admin session
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
  next();
}
