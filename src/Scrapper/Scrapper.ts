import {MAX_DEPTH, MAX_NUM_OF_LINKS, mockLinks, NUM_OF_LINKS_TO_CHOOSE} from "../consts.js";
import ScrapperRedis from "./ScrapperRedis.js";

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
                const html = await this.parseHtml(link)
                const subLinks = this.getSublinks(html);
                for(const link of subLinks) {
                    numOfLinksAdded += (await this.enqueUniqueLink(link, 0));
                }
            } catch (e) {
                console.log(`failed to parse ${link}`)
            }
        }
        return numOfLinksAdded;
    }

    static async parseHtml(url: string): Promise<string> {
        // In here we will also need to check if the link returns an html or an error(for any reason)
        // const response = await axios.get(url);
        // return render(htmlParse.parseDocument(response.data));
        return "<html> mock html </html>"
    }
    private static getSublinks(html: string): string[] {
        mockLinks.sort(() => Math.random() - 0.5);
        return mockLinks.slice(0, NUM_OF_LINKS_TO_CHOOSE)
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

