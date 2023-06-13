import {MOCK_LINKS, NUM_OF_LINKS_TO_CHOOSE} from "../consts.js";
class HtmlParser {
    static async parseHtml(url: string): Promise<string> {
        // In here we will also need to check if the link returns an html or an error(for any reason)
        // const response = await axios.get(url);
        // return render(htmlParse.parseDocument(response.data));
        return "<html> mock html </html>"
    }
    static getSublinks(html: string): string[] {
        MOCK_LINKS.sort(() => Math.random() - 0.5);
        return MOCK_LINKS.slice(0, NUM_OF_LINKS_TO_CHOOSE)
    }
} export default HtmlParser;
