export declare const comments: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "comments";
    schema: undefined;
    columns: {
        createdAt: import("drizzle-orm/pg-core").PgBuildColumn<"comments", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgTimestampBuilder>>, {
            name: string;
            tableName: "comments";
            dataType: "object date";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            identity: undefined;
            generated: undefined;
        }>;
        updatedAt: import("drizzle-orm/pg-core").PgBuildColumn<"comments", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgTimestampBuilder>>, {
            name: string;
            tableName: "comments";
            dataType: "object date";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            identity: undefined;
            generated: undefined;
        }>;
        id: import("drizzle-orm/pg-core").PgBuildColumn<"comments", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetIsPrimaryKey<import("drizzle-orm/pg-core").PgUUIDBuilder>>, {
            name: string;
            tableName: "comments";
            dataType: "string uuid";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            identity: undefined;
            generated: undefined;
        }>;
        content: import("drizzle-orm/pg-core").PgBuildColumn<"comments", import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgTextBuilder<[string, ...string[]]>>, {
            name: string;
            tableName: "comments";
            dataType: "string";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            identity: undefined;
            generated: undefined;
        }>;
        commentedById: import("drizzle-orm/pg-core").PgBuildColumn<"comments", import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgUUIDBuilder>, {
            name: string;
            tableName: "comments";
            dataType: "string uuid";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            identity: undefined;
            generated: undefined;
        }>;
        issueId: import("drizzle-orm/pg-core").PgBuildColumn<"comments", import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgUUIDBuilder>, {
            name: string;
            tableName: "comments";
            dataType: "string uuid";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            identity: undefined;
            generated: undefined;
        }>;
    };
    dialect: 'pg';
}>;
//# sourceMappingURL=comments.d.ts.map