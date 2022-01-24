const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [   
    {
        name: 'The morning lk',
        address: 'https://www.themorning.lk/category/news//',
        base: ''
    },
    {
        name: 'Island',
        address: 'https://island.lk/category/news/',
        base: ''
    },
    {
        name: 'Adaderana',
        address: 'http://www.adaderana.lk/hot-news',
        base: ''
    },
    {
        name: 'Dailynews',
        address: 'https://dailynews.lk/category/local',
        base: ''
    },
    {
        name: 'Sirasa',
        address: 'https://www.newsfirst.lk/latest-news/',
        base: ''
    }

]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("coronavirus"), a:contains("covid"), a:contains("Shani"), a:contains("booster") ,a:contains("Rajapaksha"),a:contains("Ranjan")' ,  html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
