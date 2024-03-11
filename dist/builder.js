"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.builder = void 0;
const core_1 = __importDefault(require("@pothos/core"));
const graphql_scalars_1 = require("graphql-scalars");
const db_1 = require("./db");
exports.builder = new core_1.default({ prisma: { client: db_1.prisma } });
exports.builder.addScalarType("DateTime", graphql_scalars_1.DateTimeResolver, {});
// builder.addScalarType('DateTime', DateTimeResolver, {})
// model User {
//   id        Int      @id @default(autoincrement())
//   username  String   @unique
//   email     String   @unique
//   password  String
//   sentMessages Message[] @relation("SentMessages")
//   receivedMessages Message[] @relation("ReceivedMessages")
// }
// model Message {
//   id        Int      @id @default(autoincrement())
//   message     String
//   createdAt   DateTime  @default(now())
//   authorId    Int
//   receiverId  Int
//   author      User      @relation(name: "SentMessages", fields: [authorId], references: [id])
//   receiver    User      @relation(name: "ReceivedMessages", fields: [receiverId], references: [id])
// }
// export const builder = new SchemaBuilder<{
//   PrismaTypes: PrismaTypes;
//   Context: {};
//   Scalars: {
//     DateTime: {
//       Input: Date;
//       Output: Date;
//     };
//   };
// }>({
//   plugins: [PrismaPlugin],
//   prisma: {
//     client: prisma,
//   },
// });
// builder.queryType({});
// builder.mutationType({});
