import { PrismaClient, User, Message } from "@prisma/client";
import { MessageObj } from "./user";
import { builder } from "../builder";
import { prisma as db } from "../db";
import { PubSub, withFilter } from "graphql-subscriptions";
const pubsub: any = new PubSub();

type message = {
  id: number;
  message: string;
  createdAt: Date;
  authorId: number;
  receiverId: number;
};
