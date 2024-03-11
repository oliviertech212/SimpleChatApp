"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const apollo_server_1 = require("apollo-server");
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_core_2 = require("apollo-server-core");
const client_1 = require("@prisma/client");
const schema_1 = require("./schema");
const prisma = new client_1.PrismaClient();
exports.server = new apollo_server_1.ApolloServer({
    schema: schema_1.schema,
    context: async ({ req, res }) => ({
        req,
    }),
    plugins: [
        process.env.NODE_ENV === "production"
            ? (0, apollo_server_core_2.ApolloServerPluginLandingPageProductionDefault)({
                graphRef: "my-graph-id@my-graph-variant",
                footer: false,
            })
            : (0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)({ footer: false }),
    ],
});
const port = process.env.PORT || 4000;
const app = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database");
        exports.server.listen({ port }).then(({ url }) => {
            console.log(`  Server ready at ${url}`);
        });
    }
    catch (error) {
        console.error(error);
    }
};
app();
