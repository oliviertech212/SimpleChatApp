"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = async (id) => {
    const secret = process.env.JWT_SECRET || "";
    try {
        return jsonwebtoken_1.default.sign({ id }, secret, {
            expiresIn: "30d",
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.default = generateToken;
