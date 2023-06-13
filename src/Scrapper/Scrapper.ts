import {MAX_DEPTH, MAX_NUM_OF_LINKS } from "../consts.js";
import ScrapperDB from "./scrapperDB.js";
import HtmlParser from "./HtmlParser.js";
// import ScrapperRedis from "./ScrapperRedis.js";
import {MongoLinkInterface} from "./mongoLinkInterface.js";

class Scrapper {
    static queue: {link: string, depth: number}[] = [];

    static async parseURL(url: string): Promise<number> {
        if(!url) {
            throw new Error('no or empty url given')
        }
        let numOfLinksAdded = await this.enqueUniqueLink(url,await HtmlParser.parseHtml(url), 0);
        if(numOfLinksAdded === 0) {
            return 0;
        }
        while(this.queue.length > 0 ) {
            const {link, depth} = this.queue.shift();
            if(depth > MAX_DEPTH || numOfLinksAdded > MAX_NUM_OF_LINKS) {
                continue;
            }
            try {
                const html = await HtmlParser.parseHtml(link)
                const subLinks = HtmlParser.getSublinks(html);
                for(const link of subLinks) {
                    numOfLinksAdded += (await this.enqueUniqueLink(link, html, 0));
                }
            } catch (e) {
                console.log(`failed to parse ${link}`)
            }
        }
        return numOfLinksAdded;
    }

    private static async enqueUniqueLink(link: string, html: string, depth: number): Promise<number> {
        const isDuplicate = await ScrapperDB.isDuplicate(link);
        if(isDuplicate) {
            return 0;
        }
        await ScrapperDB.addUnique(link, html)
        this.queue.push({link, depth});
        return 1;
    }
    static async doesLinkExist(url: string): Promise<boolean> {
        return ScrapperDB.isDuplicate(url)
    }
    static async getLinkData(url: string): Promise<MongoLinkInterface> {
        return await ScrapperDB.getLinkData(url);
    }

} export default Scrapper

