"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class ApiApp {
    constructor() {
        this.app = (0, express_1.default)();
        this.setupGlobalMiddleware();
        this.setupRouters();
    }
    start(port = 3000) {
        return this.app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`listening on port ${port}`);
        });
    }
    getApp() {
        return this.app;
    }
    setupGlobalMiddleware() {
        this.app.use(express_1.default.json());
    }
    setupRouters() {
        this.app.get('/', (_, res) => {
            res.json({ message: 'Welcome to our service!' });
        });
        // set up router later
    }
}
exports.default = new ApiApp();
