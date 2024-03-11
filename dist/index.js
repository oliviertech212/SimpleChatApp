"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const client_1 = require("@prisma/client");
const standalone_1 = require("@apollo/server/standalone");
const schema_1 = require("./schema");
const prisma = new client_1.PrismaClient();
const server = new server_1.ApolloServer({ schema: schema_1.schema });
const app = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database");
        const url = await (0, standalone_1.startStandaloneServer)(server, {
            listen: { port: process.env.PORT },
            context: async ({ req, res }) => ({
                req,
            }),
        });
        console.log(`🚀  Server ready at:    http://localhost:${process.env.PORT}     `);
    }
    catch (error) {
        console.error(error);
    }
};
app();
