"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const client_1 = require("@prisma/client");
const standalone_1 = require("@apollo/server/standalone");
const schema_1 = require("./schema");
const prisma = new client_1.PrismaClient();
const server = new server_1.ApolloServer({ schema: schema_1.schema });
// server.start().then(({ url }: any) => {
//   console.log(`Server ready at ${url}`);
// });
const app = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database");
        const url = (0, standalone_1.startStandaloneServer)(server, {
            listen: { port: 4000 },
        });
        console.log(`🚀  Server ready at: ${url}  `);
    }
    catch (error) {
        console.error(error);
    }
};
app();
