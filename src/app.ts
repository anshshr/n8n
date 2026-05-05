import express from "express";
import { appConfig } from "./config/env.js";
import router from "./router.js";
import errorMiddleware from "./middlewares/error.middleware..js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.use(errorMiddleware);
app.get("/", (req, res) => {
  res.send("server is up and live");
});

app.get("/health", (req, res) => {
  res.send("server is running healthy");
});

export default app;
