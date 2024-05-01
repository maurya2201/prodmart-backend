"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    uid: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    thumbnail: String,
    totalprice: Number
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model("Order", orderSchema);
