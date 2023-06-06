import express from "express";
import handle from "./middleware.js";
import "dotenv/config";
import setup from "./setup.js";

await setup();

const PORT = 3000;

const app = express();

app.use(handle);

app.use(express.static(process.env.SERVER_PATH ?? "./server"));

app.listen(PORT, () => {
  console.log(`Astro ISR Server listening on port ${PORT}`);
});
