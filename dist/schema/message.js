"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = require("../builder");
const MessageObject = builder_1.builder.objectRef("Message");
MessageObject.implement({
    fields: (t) => ({
        id: t.exposeID("id"),
        message: t.exposeString("message"),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        authorId: t.exposeID("authorId"),
        receiverId: t.exposeID("receiverId"),
    }),
});
