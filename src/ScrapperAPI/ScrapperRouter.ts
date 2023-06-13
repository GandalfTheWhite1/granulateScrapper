import {Router} from 'express';
import Scrapper from "../Scrapper/Scrapper.js";

class ScrapperRouter {
    router: Router = Router();
    constructor() {
        this.initRouters();
    }

    private initRouters() {
        this.router.post('/parse', async (req, res) => {
            // Get the request parameters
            const url: string = req.body?.url;
            if (!url) {
                return res.status(400).json({error: 'no url in given request'});
            }
            try {
                const scrappedInfo = await Scrapper.parseURL(url)

                return res.json(scrappedInfo);
            } catch (e) {
                return res.status(500).json({error: 'unexpected error has occurred: ' + e.toString()})
            }
        });
        this.router.get('/parsedData', async (req, res) => {
            try {
                const url = req.query.url;
                if(!url) {
                    return res.status(400).json({error: 'no url given'})
                }
                const data = await Scrapper.getLinkData(url)
                if (!data) {
                    return res.status(400).json({error: 'no such url has been saved'})
                }
                return res.json({url: data.url, html: data.html})
            } catch (e) {
                return res.status(500).json({error: 'unexpected error has occurred: ' + e.toString()})
            }
        })
    }
}

export default ScrapperRouter;
