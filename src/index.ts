import express from 'express';
import ScrapperRouter from './ScrapperAPI/ScrapperRouter.js';
import ScrapperDB from "./Scrapper/scrapperDB.js";

const app = express();
app.use(express.json());
app.use('/', new ScrapperRouter().router)
const port = 3000;
try {
    await ScrapperDB.init();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
} catch (e) {
    console.log('something failed during db init, shutting down server', e)
}

