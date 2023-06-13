import IORedisMock from 'ioredis-mock';
import redis from 'ioredis'
const redisKey = 'links'
class ScrapperRedis {
    static redisClient: redis.Redis;
    static init() {

        this.redisClient = this.createRedisClient();
    }
    static async isDuplicate(link: string): Promise<boolean> {
        return  await this.redisClient.sismember(redisKey, link) === 1
    }
    static async addUnique(link: string): Promise<boolean> {
        return await this.redisClient.sadd(redisKey, link) === 1
    }
    static async removeLink(link: string): Promise<boolean> {
        return await this.redisClient.del(redisKey, link) === 1
    }
    static async clearLinks(): Promise<number> {
        return await this.redisClient.del(redisKey)
    }
    static createRedisClient() {
        // @ts-ignore
        return new IORedisMock()
    }
    static async closeDB() {
        // mock redis doesn't support shutdown.
        // await this.redisClient.shutdown();
    }

}export default ScrapperRedis;