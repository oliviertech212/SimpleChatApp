import { ApolloServer } from "@apollo/server";
import { PrismaClient, User, Message } from "@prisma/client";
import { startStandaloneServer } from "@apollo/server/standalone";
import { builder } from "./builder";
import { schema } from "./schema";
const prisma = new PrismaClient();

const server = new ApolloServer({ schema });

const app = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
    const url = await startStandaloneServer(server, {
      listen: { port: process.env.PORT as any },
      context: async ({ req, res }) => ({
        req,
      }),
    });
    console.log(
      `🚀  Server ready at:    http://localhost:${process.env.PORT}     `
    );
  } catch (error) {
    console.error(error);
  }
};

app();
