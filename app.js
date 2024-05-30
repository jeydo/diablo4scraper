const express = require('express')
const app = express()
const port = 3000
const scraper = require('./scraper.js')
const builder = require('./builder.js')

app.use(express.json())

app.post('/scrapebuild', (req, res) => {
    const url = req.body.url;
    if (!url.startsWith('https://maxroll.gg/d4/planner/') && !url.startsWith('https://d4builds.gg/builds/')) {
        console.error('URL Failed : ' + url)
        return res.status(500).json({
            error : 'Url must be a maxroll.gg planner : https://maxroll.gg/d4/planner/... or a d4builds.gg link : https://d4builds.gg/builds/...'
        });
    }
    const rx = /https:\/\/(maxroll|d4builds)\.gg/g;
    const execRx = rx.exec(url)
    const scraperFn = 'scrape' + execRx[1].charAt(0).toUpperCase() + execRx[1].slice(1)
    console.log(scraperFn)
    console.log(url)
    new Promise((resolve, reject) => {
        scraper[scraperFn](url).then(data => {
            const build = new builder(data.name);
            build.buildObject(data);
            res.json(build)
        }); 
    })
})

app.listen(port, () => {
    console.log(`Scraping app listening on port ${port}`)
})
