import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicDir = path.resolve(__dirname, "../public");
app.use("/banners", express.static(path.join(publicDir, "banners")));

app.use(
  "/admin",
  express.static(path.join(publicDir, "admin"), { index: "index.html" }),
);

app.use("/public", express.static(publicDir, { index: "index.html" }));

app.use("/api", router);

app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

export default app;
