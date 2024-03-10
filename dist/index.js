"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const core_1 = __importDefault(require("@pothos/core"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// @ts.ignore
const builder = new core_1.default({ prisma: { client: prisma } });
builder.queryType({
    fields: (t) => ({
        hello: t.string({
            resolve: () => "Hello world!",
        }),
    }),
});
const schema = builder.toSchema();
const server = new server_1.ApolloServer({ schema });
// server.start().then(({ url }: any) => {
//   console.log(`Server ready at ${url}`);
// });
server
    .start()
    .then(({ url }) => {
    console.log(`Server ready at ${url}`);
})
    .catch((error) => {
    console.error("Error starting the server:", error);
});
