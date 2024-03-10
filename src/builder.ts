import SchemaBuilder from "@pothos/core";
import { PrismaClient, User, Message } from "@prisma/client";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaTypes from "./prisma/pothos-types";
// import { DateTimeResolver } from 'graphql-scalars'
import { prisma as db } from "./db";

export const builder = new SchemaBuilder({ prisma: { client: db } });

type user = {
  id: number;
  username: string;
  email: string;
  password: string;
  sentMessages: Message[];
  receivedMessages: Message[];
};

type message = {
  id: number;
  message: string;
  createdAt: Date;
  authorId: number;
  receiverId: number;
};

const UserObject = builder.objectRef<User>("User");
const MessageObject = builder.objectRef<Message>("Message");
UserObject.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    username: t.exposeString("username"),
    email: t.exposeString("email"),
    password: t.exposeString("password"),
  }),
});

builder.queryType({
  fields: (t) => ({
    get_me: t.field({
      type: UserObject,
      resolve: (root, args, ctx) =>
        db.user
          .findUniqueOrThrow({
            where: {
              id: 1,
            },
          })
          .then((user) => user as user),
    }),
  }),
});
