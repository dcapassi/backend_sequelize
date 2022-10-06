import express from "express";
import database from "./database/index";
import routes from "./routes";
import cors from "cors";
import path from "path";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.server.use(express.json());
    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "data", "uploads"))
    );
    this.server.use(cors());
  }
  routes() {
    this.server.use(routes);
  }
}

export default new App().server;

  