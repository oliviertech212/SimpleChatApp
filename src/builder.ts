import SchemaBuilder from "@pothos/core";
import { DateTimeResolver } from "graphql-scalars";
import PrismaPlugin from "@pothos/plugin-prisma";
import { prisma as db } from "./db";

type user = {
  id: number;
  username: string;
  email: string;
  password: string;
  sentMessages: message[];
  receivedMessages: message[];
};

type UserWithToken = {
  id: number;
  username: string;
  email: string;
  token: string;
};
interface Args {
  username: string;
  email: string;
  password: string;
}

type message = {
  id: number;
  message: string;
  createdAt: Date;
  authorId: number;
  receiverId: number;
};

export const builder = new SchemaBuilder<{
  Context: {};
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({ prisma: { client: db } });

builder.addScalarType("DateTime", DateTimeResolver, {});
