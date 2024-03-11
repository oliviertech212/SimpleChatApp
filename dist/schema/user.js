"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = require("../builder");
const db_1 = require("../db");
const UserObject = builder_1.builder.objectRef("User");
UserObject.implement({
    fields: (t) => ({
        id: t.exposeID("id"),
        username: t.exposeString("username"),
        email: t.exposeString("email"),
        password: t.exposeString("password"),
    }),
});
builder_1.builder.queryType({
    fields: (t) => ({
        get_me: t.field({
            type: UserObject,
            resolve: (root, args, ctx) => db_1.prisma.user
                .findUniqueOrThrow({
                where: {
                    id: 1,
                },
            })
                .then((user) => user),
        }),
    }),
});
