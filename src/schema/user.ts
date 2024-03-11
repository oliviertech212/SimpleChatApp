import { PrismaClient, User, Message } from "@prisma/client";
import { builder } from "../builder";
import { prisma as db } from "../db";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import { PubSub, withFilter } from "graphql-subscriptions";
const pubsub: any = new PubSub();

type user = {
  id: number;
  username: string;
  email: string;
  password: string;
  sentMessages?: Message[];
  receivedMessages?: Message[];
  token?: string;
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
  senderId: number;
  receiverId: number;
};
const UserObject = builder.objectRef<User>("User");
export const MessageObj = builder.objectRef<Message>("Message");

MessageObj.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    message: t.exposeString("message"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    senderId: t.exposeID("senderId"),
    receiverId: t.exposeID("receiverId"),
    sender: t.field({
      type: UserObject,
      nullable: true,
      resolve: (message) => {
        return db.user.findUnique({
          where: {
            id: message.senderId,
          },
        });
      },
    }),
    receiver: t.field({
      type: UserObject,
      nullable: true,
      resolve: (message) => {
        return db.user.findUnique({
          where: {
            id: message.receiverId,
          },
        });
      },
    }),
  }),
});
UserObject.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    username: t.exposeString("username"),
    email: t.exposeString("email"),
    password: t.exposeString("password"),
    sentMessages: t.field({
      type: [MessageObj],
      nullable: true,
      resolve: (user) => {
        return db.message.findMany({
          where: {
            senderId: user.id,
          },
        });
      },
    }),

    receivedMessages: t.field({
      type: [MessageObj],
      nullable: true,
      resolve: (user) => {
        return db.message.findMany({
          where: {
            receiverId: user.id,
          },
        });
      },
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    get_user: t.field({
      type: UserObject,
      args: {
        email: t.arg.string(),
      },
      resolve: (root, args, ctx) => {
        if (!args.email) {
          throw new Error("Email is required");
        }
        return db.user
          .findUnique({
            where: {
              email: args.email as string,
            },
          })
          .then((user) => user as user);
      },
    }),

    getAllUsers: t.field({
      type: [UserObject],
      resolve: async (root, args, ctx) => {
        const users = await db.user.findMany();
        return users;
      },
    }),
    messages: t.field({
      type: [MessageObj],
      nullable: true,
      resolve: () => {
        return db.message.findMany();
      },
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    register: t.field({
      type: UserObject,
      args: {
        username: t.arg.string(),
        email: t.arg.string(),
        password: t.arg.string(),
      },
      resolve: async (root, args, ctx) => {
        const hashedPassword = bcrypt.hashSync((args as Args).password, 8);
        return db.user
          .create({
            data: {
              username: (args as Args).username,
              email: (args as Args).email,
              password: hashedPassword,
            },
          })
          .catch((error) => {
            throw new Error(error);
          });
      },
    }),

    writemessage: t.field({
      type: MessageObj,
      args: {
        message: t.arg.string(),
        senderId: t.arg.id(),
        receiverId: t.arg.id(),
      },
      resolve: async (root, args, ctx) => {
        const message = await db.message.create({
          data: {
            message: args.message as string,
            senderId: Number(args.senderId),
            receiverId: Number(args.receiverId),
          },
        });
        // publish new message
        pubsub.publish("newmessage", { newmessage: message });
        return message;
      },
    }),

    login: t.field({
      type: UserObject,
      args: {
        email: t.arg.string(),
        password: t.arg.string(),
      },
      // @ts-ignore
      resolve: async (root, args, ctx) => {
        const user = await db.user.findUnique({
          where: {
            email: args.email as string,
          },
        });
        if (!user) {
          throw new Error("User not found");
        }
        const token = await generateToken(user.id);
        const valid = bcrypt.compareSync(
          (args as Args).password,
          user.password
        );
        if (!valid) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  }),
});
