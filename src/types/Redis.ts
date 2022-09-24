export interface IRedisServiceConstructorOpts {
    expiresInSeconds: number;
}

export interface ISetCacheValueOpts {
    expriesInSeconds?: number;
    key: string;
    value: string;
}
