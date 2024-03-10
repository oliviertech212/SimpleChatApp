"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.builder = void 0;
const core_1 = __importDefault(require("@pothos/core"));
const client_1 = require("@prisma/client");
const plugin_prisma_1 = __importDefault(require("@pothos/plugin-prisma"));
// import { DateTimeResolver } from 'graphql-scalars'
// import { prisma } from './db'
const prisma = new client_1.PrismaClient();
exports.builder = new core_1.default({
    plugins: [plugin_prisma_1.default],
    prisma: {
        client: prisma,
    },
});
exports.builder.queryType({});
exports.builder.mutationType({});
// builder.addScalarType('DateTime', DateTimeResolver, {})
