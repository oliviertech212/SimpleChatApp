import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { ApolloServerPluginLandingPageProductionDefault } from "apollo-server-core";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { PrismaClient } from "@prisma/client";

import { schema } from "./schema";
const prisma = new PrismaClient();

export const server = new ApolloServer({
  schema,
  context: async ({ req, res }) => ({
    req,
  }),
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault({
          graphRef: "my-graph-id@my-graph-variant",
          footer: false,
        })
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
});

const port = process.env.PORT || 4000;

const app = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");

    server.listen({ port }).then(({ url }) => {
      console.log(`  Server ready at ${url}`);
    });
  } catch (error) {
    console.error(error);
  }
};

app();
