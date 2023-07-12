import setup from "./setup.js";
import express from "express";
import isrMiddleware from "./middleware.js";
import revalidate from "./revalidate.js";
import "dotenv/config";

await setup();

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(isrMiddleware);

app.post("/revalidate", revalidate);

app.use(express.static(process.env.SERVER_PATH ?? "./server"));

app.listen(PORT, () => {
  console.log(`Astro ISR Server listening on port ${PORT}`);
});
