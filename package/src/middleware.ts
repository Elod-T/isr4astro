import path from "path";
import { copyFiles } from "./utils";
import STORE from "./store";
import { exec } from "child_process";
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

function buildPath(url: string) {
  const absPath = path.resolve("."); // this way it works both in prod and dev, instead of using __dirname
  const buildPath = url.slice(0, url.length - 1);

  exec(
    `node ${absPath}/node_modules/@isr4astro/core/node_modules/@isr4astro/astro/astro.js build --root ${absPath} --singlePath ${buildPath}`,
    (err, stdout, stderr) => {
      if (err) {
        return;
      }

      copyFiles()
        .then(() => {
          STORE[url] = new Date();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  );
}
