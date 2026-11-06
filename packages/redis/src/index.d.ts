export declare const initRedis: (url: string) => Promise<import("redis").RedisClientType<import("redis").RedisModules, import("redis").RedisFunctions, import("redis").RedisScripts, import("redis").RespVersions, import("redis").TypeMapping>>;
export declare const getRedis: () => import("redis").RedisClientType<import("redis").RedisModules, import("redis").RedisFunctions, import("redis").RedisScripts, import("redis").RespVersions, import("redis").TypeMapping>;
export declare const closeRedis: () => Promise<void>;
//# sourceMappingURL=index.d.ts.map