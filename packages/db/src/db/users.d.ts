export declare const users: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "users";
    schema: undefined;
    columns: {
        createdAt: import("drizzle-orm/pg-core").PgBuildColumn<"users", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgTimestampBuilder>>, {
            name: string;
            tableName: "users";
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
        updatedAt: import("drizzle-orm/pg-core").PgBuildColumn<"users", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgTimestampBuilder>>, {
            name: string;
            tableName: "users";
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
        id: import("drizzle-orm/pg-core").PgBuildColumn<"users", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetIsPrimaryKey<import("drizzle-orm/pg-core").PgUUIDBuilder>>, {
            name: string;
            tableName: "users";
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
        email: import("drizzle-orm/pg-core").PgBuildColumn<"users", import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgTextBuilder<[string, ...string[]]>>, {
            name: string;
            tableName: "users";
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
        username: import("drizzle-orm/pg-core").PgBuildColumn<"users", import("drizzle-orm/pg-core").PgTextBuilder<[string, ...string[]]>, {
            name: string;
            tableName: "users";
            dataType: "string";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            identity: undefined;
            generated: undefined;
        }>;
        profilePictureUrl: import("drizzle-orm/pg-core").PgBuildColumn<"users", import("drizzle-orm/pg-core").PgTextBuilder<[string, ...string[]]>, {
            name: string;
            tableName: "users";
            dataType: "string";
            data: string;
            driverParam: string;
            notNull: false;
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
//# sourceMappingURL=users.d.ts.map