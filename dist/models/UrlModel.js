"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UrlSchema = new mongoose_1.Schema({
    url: {
        type: String,
        require: true,
        unique: true,
    },
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: { createdAt: true, updatedAt: true } });
exports.default = (0, mongoose_1.model)('Url', UrlSchema, 'urls');
//# sourceMappingURL=UrlModel.js.map