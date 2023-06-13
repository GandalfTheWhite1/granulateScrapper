// import {MongoMemoryServer} from "mongodb-memory-server";
// import {Collection, Db, MongoClient} from "mongodb";
//
// class ScrapperDB {
//
//     static scrapperDB: ScrapperDB = new ScrapperDB();
//     private db: Db;
//     private collection: Collection<any>;
//     private mongod: MongoMemoryServer;
//     static async init() {
//         const uri: string = await this.getMockMongoConnectionString();
//         await this.scrapperDB.connectToMongo(uri);
//     }
//     static async getMockMongoConnectionString(): Promise<string> {
//         if(!this.scrapperDB.mongod) {
//             this.scrapperDB.mongod = await MongoMemoryServer.create();
//         }
//         return this.scrapperDB.mongod.getUri();
//     }
//     async connectToMongo(uri: string): Promise<Collection<any>> {
//         const client = await MongoClient.connect(uri);
//         this.db = client.db();
//         this.collection = this.db.collection('urls')
//         return this.collection
//     }
//     static async saveParsedResult(url: string, html: string, links: string[]): Promise<any> {
//         const collection = this.scrapperDB.collection;
//         return await collection.replaceOne({url : url}, {url, html, links}, {upsert: true})
//     }
//     static async getParsedResult(url: string): Promise<any> {
//         return await this.scrapperDB.collection.findOne({url})
//     }
//
// } export default ScrapperDB