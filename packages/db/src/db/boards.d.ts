export declare const boards: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "boards";
    schema: undefined;
    columns: {
        createdAt: import("drizzle-orm/pg-core").PgBuildColumn<"boards", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgTimestampBuilder>>, {
            name: string;
            tableName: "boards";
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
        updatedAt: import("drizzle-orm/pg-core").PgBuildColumn<"boards", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgTimestampBuilder>>, {
            name: string;
            tableName: "boards";
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
        id: import("drizzle-orm/pg-core").PgBuildColumn<"boards", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetIsPrimaryKey<import("drizzle-orm/pg-core").PgUUIDBuilder>>, {
            name: string;
            tableName: "boards";
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
        title: import("drizzle-orm/pg-core").PgBuildColumn<"boards", import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgTextBuilder<[string, ...string[]]>>, {
            name: string;
            tableName: "boards";
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
        description: import("drizzle-orm/pg-core").PgBuildColumn<"boards", import("drizzle-orm/pg-core").PgTextBuilder<[string, ...string[]]>, {
            name: string;
            tableName: "boards";
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
        organizationId: import("drizzle-orm/pg-core").PgBuildColumn<"boards", import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgUUIDBuilder>, {
            name: string;
            tableName: "boards";
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
//# sourceMappingURL=boards.d.ts.map