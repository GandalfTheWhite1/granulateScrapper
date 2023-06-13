import {MAX_DEPTH, MAX_NUM_OF_LINKS, MOCK_LINKS, NUM_OF_LINKS_TO_CHOOSE} from "../consts.js";
import ScrapperRedis from "./ScrapperRedis.js";
import HtmlParser from "./HtmlParser.js";

class Scrapper {
    static queue: {link: string, depth: number}[] = [];

    static async parseURL(url: string): Promise<number> {
        if(!url) {
            throw new Error('no or empty url given')
        }
        let numOfLinksAdded = await this.enqueUniqueLink(url, 0);
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
                    numOfLinksAdded += (await this.enqueUniqueLink(link, 0));
                }
            } catch (e) {
                console.log(`failed to parse ${link}`)
            }
        }
        return numOfLinksAdded;
    }

    private static async enqueUniqueLink(link: string, depth: number): Promise<number> {
        const isDuplicate = await ScrapperRedis.isDuplicate(link);
        if(isDuplicate) {
            return 0;
        }
        await ScrapperRedis.addUnique(link)
        this.queue.push({link, depth});
        return 1;
    }
    static async doesLinkExist(url: string): Promise<boolean> {
        return ScrapperRedis.isDuplicate(url)
    }

} export default Scrapper

