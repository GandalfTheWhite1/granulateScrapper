import {MongoMemoryServer} from "mongodb-memory-server";
import {Collection, Db, MongoClient} from "mongodb";
import {MongoLinkInterface} from "./mongoLinkInterface.js";

class ScrapperDB {

    static scrapperDB: ScrapperDB = new ScrapperDB();
    private db: Db;
    private collection: Collection<any>;
    private mongod: MongoMemoryServer;
    private client: MongoClient;
    static async init() {
        const uri: string = await this.getMongoURI();
        await this.scrapperDB.connectToMongo(uri);
        await this.scrapperDB.initCollections();
    }
    static async getMongoURI(): Promise<string> {
        if(!this.scrapperDB.mongod) {
            this.scrapperDB.mongod = await MongoMemoryServer.create();
        }
        return this.scrapperDB.mongod.getUri();
    }
    async connectToMongo(uri: string): Promise<MongoClient> {
        this.client = await MongoClient.connect(uri);
        return this.client;
    }
    async initCollections(): Promise<Collection<any>> {
        this.db = this.client.db();
        this.collection = this.db.collection('urls')
        return this.collection
    }
    // static async saveParsedResult(url: string, html: string): Promise<any> {
    //     const collection = this.scrapperDB.collection;
    //     return await collection.replaceOne({url : url}, {url, html}, {upsert: true})
    // }
    static async addUnique(url: string, html: string): Promise<boolean> {
        if(await this.isDuplicate(url)) {
            return false;
        }
        return !!await this.scrapperDB.collection.insertOne({url, html})
    }
    static async isDuplicate(url: string): Promise<boolean> {
        const doc = (await this.scrapperDB.collection.findOne({url: url}));
        return doc !== null
    }
    static async getParsedResult(url: string): Promise<any> {
        return await this.scrapperDB.collection.findOne({url})
    }
    static async removeLink(link: string): Promise<boolean> {
        return !!(await this.scrapperDB.collection.deleteOne({url: link}))
    }
    static async clearLinks(): Promise<number> {
        return (await this.scrapperDB.collection.deleteMany({})).deletedCount
    }
    static async getLinkData(url: string): Promise<MongoLinkInterface> {
        const doc = await this.scrapperDB.collection.findOne({url: url})
        if(!doc) {
            return null;
        }
        return doc;
    }

} export default ScrapperDB