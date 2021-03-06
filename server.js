const request = require('request-promise')
const cheerio = require('cheerio')
const express = require('express')
const app     = express()

const baseURL = 'https://www.billboard.com'
const hot100  = '/charts/hot-100'

const getData = async () => {

    const html = await request(baseURL + hot100)
    
    const hotData = cheerio('ol > li > button', html).map((index, element) => {
        const rank   = element.children[1].children[1].children[0].data
        const title  = element.children[3].children[1].children[0].data
        const artist = element.children[3].children[3].children[0].data

        return {
            rank,
            title,
            artist
        }

    }).get()
    return Promise.all(hotData)

}

const port = 3000

app.get('/', (req, res) => {

    getData().then(data => {
        res.json(data)
    }).catch(error => {
        res.send("Ocorreu algum erro")
    })
})

app.listen(port, () => {
    console.log(`Running in localhost:${port}`)
})