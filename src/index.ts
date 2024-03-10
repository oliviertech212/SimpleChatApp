import { ApolloServer } from "@apollo/server";
import { PrismaClient, User, Message } from "@prisma/client";
import { startStandaloneServer } from "@apollo/server/standalone";
import { builder } from "./builder";
const prisma = new PrismaClient();

const schema = builder.toSchema();
const server = new ApolloServer({ schema });
// server.start().then(({ url }: any) => {
//   console.log(`Server ready at ${url}`);
// });

const app = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
    const url = startStandaloneServer(server, {
      listen: { port: 4000 },
    });
    console.log(`🚀  Server ready at: ${url}  `);
  } catch (error) {
    console.error(error);
  }
};

app();
