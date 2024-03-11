"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageObj = void 0;
const builder_1 = require("../builder");
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub = new graphql_subscriptions_1.PubSub();
const UserObject = builder_1.builder.objectRef("User");
exports.MessageObj = builder_1.builder.objectRef("Message");
exports.MessageObj.implement({
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
                return db_1.prisma.user.findUnique({
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
                return db_1.prisma.user.findUnique({
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
            type: [exports.MessageObj],
            nullable: true,
            resolve: (user) => {
                return db_1.prisma.message.findMany({
                    where: {
                        senderId: user.id,
                    },
                });
            },
        }),
        receivedMessages: t.field({
            type: [exports.MessageObj],
            nullable: true,
            resolve: (user) => {
                return db_1.prisma.message.findMany({
                    where: {
                        receiverId: user.id,
                    },
                });
            },
        }),
    }),
});
builder_1.builder.queryType({
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
                return db_1.prisma.user
                    .findUnique({
                    where: {
                        email: args.email,
                    },
                })
                    .then((user) => user);
            },
        }),
        getAllUsers: t.field({
            type: [UserObject],
            resolve: async (root, args, ctx) => {
                const users = await db_1.prisma.user.findMany();
                return users;
            },
        }),
        messages: t.field({
            type: [exports.MessageObj],
            nullable: true,
            resolve: () => {
                return db_1.prisma.message.findMany();
            },
        }),
    }),
});
builder_1.builder.mutationType({
    fields: (t) => ({
        register: t.field({
            type: UserObject,
            args: {
                username: t.arg.string(),
                email: t.arg.string(),
                password: t.arg.string(),
            },
            resolve: async (root, args, ctx) => {
                const hashedPassword = bcryptjs_1.default.hashSync(args.password, 8);
                return db_1.prisma.user
                    .create({
                    data: {
                        username: args.username,
                        email: args.email,
                        password: hashedPassword,
                    },
                })
                    .catch((error) => {
                    throw new Error(error);
                });
            },
        }),
        writemessage: t.field({
            type: exports.MessageObj,
            args: {
                message: t.arg.string(),
                senderId: t.arg.id(),
                receiverId: t.arg.id(),
            },
            resolve: async (root, args, ctx) => {
                const message = await db_1.prisma.message.create({
                    data: {
                        message: args.message,
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
                const user = await db_1.prisma.user.findUnique({
                    where: {
                        email: args.email,
                    },
                });
                if (!user) {
                    throw new Error("User not found");
                }
                const token = await (0, generateToken_1.default)(user.id);
                const valid = bcryptjs_1.default.compareSync(args.password, user.password);
                if (!valid) {
                    throw new Error("Invalid password");
                }
                return user;
            },
        }),
    }),
});
