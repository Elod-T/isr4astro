import path from "path";
import { copyFiles } from "./utils.js";
import STORE from "./store.js";
import fs from "fs";
import type { Request, Response, NextFunction } from "express";

const { cli } = await import(
  "../node_modules/@isr4astro/astro/dist/cli/index.js"
);

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
  const hash = url.replace(/\//g, "") + new Date().getTime().toString();
  console.log(hash);
  const absPath = path.resolve("."); // this way it works both in prod and dev, instead of using __dirname
  const buildPath = url != "/" ? url.slice(0, url.length - 1) : "/";

  cli([
    "node",
    `${absPath}/node_modules/@isr4astro/core/node_modules/@isr4astro/astro/astro.js`,
    "build",
    "--root",
    absPath,
    "--singlePath",
    buildPath,
    "--outDir",
    `isr-cache/${hash}`,
  ])
    .then(() => {
      copyFiles(`./isr-cache/${hash}`)
        .then(() => {
          STORE[url] = new Date();

          fs.rmSync(`./isr-cache/${hash}`, { recursive: true });
          console.log(`Removed ./isr-cache/${hash}`);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}
