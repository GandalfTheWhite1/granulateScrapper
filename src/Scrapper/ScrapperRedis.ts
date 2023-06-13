import IORedisMock from 'ioredis-mock';
import redis from 'ioredis'
const redisKey = 'links'
class ScrapperRedis {
    static redisClient: redis.Redis;
    static init() {

        this.redisClient = this.createRedisClient();
    }
    static async isDuplicate(link: string): Promise<boolean> {
        const res = await this.redisClient.sismember(redisKey, link)
        return res === 1;
    }
    static async addUnique(links: string): Promise<boolean> {
        const res = await this.redisClient.sadd(redisKey, links)
        return res === 1;
    }
    static async removeLink(link: string): Promise<boolean> {
        return (await this.redisClient.del(redisKey, link) === 1)
    }
    static async clearLinks(): Promise<number> {
        return await this.redisClient.del(redisKey)
    }
    static createRedisClient() {
        // @ts-ignore
        return new IORedisMock()
    }

}export default ScrapperRedis;