import * as path from "node:path";
import * as url from "node:url";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady } from "@remix-run/node";

const BUILD_PATH = path.join(process.cwd(), "build/index.js");

const initialBuild = await import(url.pathToFileURL(BUILD_PATH).href);

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" }),
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use(morgan("tiny"));

app.all(
  "*",
  createRequestHandler({
    build: initialBuild,
    mode: process.env.NODE_ENV,
  }),
);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
  broadcastDevReady(initialBuild);
});
