export declare const sections: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "sections";
    schema: undefined;
    columns: {
        createdAt: import("drizzle-orm/pg-core").PgBuildColumn<"sections", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgTimestampBuilder>>, {
            name: string;
            tableName: "sections";
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
        updatedAt: import("drizzle-orm/pg-core").PgBuildColumn<"sections", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgTimestampBuilder>>, {
            name: string;
            tableName: "sections";
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
        id: import("drizzle-orm/pg-core").PgBuildColumn<"sections", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetIsPrimaryKey<import("drizzle-orm/pg-core").PgUUIDBuilder>>, {
            name: string;
            tableName: "sections";
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
        title: import("drizzle-orm/pg-core").PgBuildColumn<"sections", import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgTextBuilder<[string, ...string[]]>>, {
            name: string;
            tableName: "sections";
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
        boardId: import("drizzle-orm/pg-core").PgBuildColumn<"sections", import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgUUIDBuilder>, {
            name: string;
            tableName: "sections";
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
        order: import("drizzle-orm/pg-core").PgBuildColumn<"sections", import("drizzle-orm/pg-core").SetHasDefault<import("drizzle-orm/pg-core").SetNotNull<import("drizzle-orm/pg-core").PgIntegerBuilder>>, {
            name: string;
            tableName: "sections";
            dataType: "number int32";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
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
//# sourceMappingURL=sections.d.ts.map