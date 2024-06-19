import { promisify } from 'util';
const redis = require("redis");
import { RedisClient } from 'redis';

 class Redis {

    private readonly redisClient: RedisClient;

    constructor() {
        this.redisClient = redis.createClient(
            {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            });
    }

    /**
     * Add value to redis storage
     * @param hashSetName HashSet name where the value will be stored
     * @param key Key
     * @param value Value to store
     */
    async add<T>(hashSetName: string, key: string, value: T) {
        const redisHset = promisify(this.redisClient.hset).bind(this.redisClient);

        await redisHset([hashSetName, key, JSON.stringify(value)]);
    }

    /**
     * Temporarly saves data in redisDB
     * @param key Key
     * @param value The value which will be stored
     * @param lifeTime The life time of the value, after this time redis will be remove value
     */
    async addTemporal<T>(key: string, value: T, lifeTime: number): Promise<void> {

        const redisSET = promisify(this.redisClient.set).bind(this.redisClient);
        const redisEXPIRE = promisify(this.redisClient.expire).bind(this.redisClient);
        await redisSET(key, JSON.stringify(value));
        await redisEXPIRE(key, lifeTime);
    }

    /**
     * Returns temporal value by the key
     * @param key The key, under this key, value, was stored
     */
    async getTemporal<T>(key: string): Promise<T | null> {

        const redisGET = promisify(this.redisClient.get).bind(this.redisClient);
        const value = await redisGET(key);

        if (value === null || value === undefined)
            return null;

        return JSON.parse(value);
    }

    /**
     * Remove temporal value from redis DB
     * @param key The key, under this key, value, was stored
     */
    async deleteTemporal(key: string): Promise<void> {
        return new Promise((resolve: Function, reject: Function) => {
            this.redisClient.del(key, (error) => {
                if (error)
                    return reject();

                resolve();
            })
        });
    }

    /**
     * Return the value, stored in redis DB
     * @param hashSetName The HashSet name in which value is stored
     * @param key The key
     */
    async get<T>(hashSetName: string, key: string): Promise<T | null> {
        const redisHGET = promisify(this.redisClient.hget).bind(this.redisClient);
        const value = await redisHGET(hashSetName, key);

        if (value === null || value === undefined)
            return null;

        return JSON.parse(value);
    }

    /**
     * Remove the value from the HashSet
     * @param hashSetName The HashSet name
     * @param key The key
     */
    async delete(hashSetName: string, key: string): Promise<void> {
        return new Promise((resolve: Function, reject: Function) => {
            this.redisClient.hdel(hashSetName, key, (error) => {
                if (error)
                    return reject();
                resolve();
            });
        });
    }

    /**
     * Return all values from the HashSet in redis DB
     * @param hashSetName The HashSet name
     */
    async getAll(hashSetName: string): Promise<{ [key: string]: string }> {

        return new Promise((resolve: Function, reject: Function) => {
            this.redisClient.hgetall(hashSetName, (error, data: { [key: string]: string }) => {
                if (error)
                    return reject(error);

                resolve(data);
            });
        });

    }
}

export default new Redis();