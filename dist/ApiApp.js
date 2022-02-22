"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ShortenUrl_1 = __importDefault(require("./routers/ShortenUrl"));
var ApiApp = /** @class */ (function () {
    function ApiApp() {
        this.app = (0, express_1.default)();
        this.setupGlobalMiddleware();
        this.setupRouters();
    }
    ApiApp.prototype.start = function (port) {
        if (port === void 0) { port = 3000; }
        return this.app.listen(port, function () {
            // eslint-disable-next-line no-console
            console.log("listening on port ".concat(port));
        });
    };
    ApiApp.prototype.getApp = function () {
        return this.app;
    };
    ApiApp.prototype.setupGlobalMiddleware = function () {
        this.app.use(express_1.default.json());
    };
    ApiApp.prototype.setupRouters = function () {
        this.app.get('/', function (_, res) {
            res.json({ message: 'Welcome to our service!' });
        });
        this.app.use('/urls', ShortenUrl_1.default.getRouter());
    };
    return ApiApp;
}());
exports.default = new ApiApp();
//# sourceMappingURL=ApiApp.js.map