import STORE from "./store.js";
import { buildPath } from "./revalidate.js";
import type { Request, Response, NextFunction } from "express";

export default function isrMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`${req.method} ${req.url}`);

  if (req.url.endsWith("/")) {
    if (STORE[req.url]) {
      console.log(`Found ${req.url} in store`);
      const now = new Date();
      const then = STORE[req.url];
      const diff = now.getTime() - then.getTime();
      const seconds = Math.floor(diff / 1000);

      if (seconds < parseInt(process.env.REVALIDATE ?? "60")) {
        console.log(`Using cached version for ${req.url}`);
        next();
        return;
      }
    }

    console.log(`Building new version for ${req.url}`);
    buildPath(req.url);

    res.header("Refresh", "10");
  }

  next();
}
