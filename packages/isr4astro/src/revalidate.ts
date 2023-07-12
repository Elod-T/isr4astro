import path from "path";
import { copyFiles } from "./utils.js";
import fs from "fs";
import STORE from "./store.js";
import type { Request, Response } from "express";

const { cli } = await import(
  "../node_modules/@isr4astro/astro/dist/cli/index.js"
);

export default function revalidate(req: Request, res: Response) {
  const { path } = req.body;

  if (!path) {
    res.status(400).send("Missing path");
    return;
  }

  if (!path.endsWith("/")) {
    res.status(400).send("Path must end with /");
    return;
  }

  console.log(`Manually revalidate ${path}`);
  buildPath(path);

  res.status(200).send("OK");
}

export function buildPath(url: string) {
  const hash = url.replace(/\//g, "") + new Date().getTime().toString();
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
