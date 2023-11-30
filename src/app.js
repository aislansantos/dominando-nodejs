import express from "express";
// import authMiddleware from "./app/middlewares/auth";
import routes from "./routes";

import "./database";

class App {
    constructor() {
        this.server = express();

        this.middleware();
        this.routes();
    }

    middleware() {
        this.server.use(express.json());
        // this.server.use(authMiddleware);
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server; // O interessante é exportar somente o server
