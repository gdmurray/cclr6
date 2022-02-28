const fs = require('fs')
const cheerio = require('cheerio')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const writer = createCsvWriter({
    path: 'bans.csv',
    header: [
        {
            id: 'uplay',
            title: 'uplay',
        },
        {
            id: 'uplay_id',
            title: 'uplay_id',
        },
        {
            id: 'reason',
            title: 'reason',
        },
        {
            id: 'timestamp',
            title: 'timestamp',
        },
    ],
})

fs.readFile('./discord.html', { encoding: 'utf-8' }, (err, data) => {
    const $ = cheerio.load(data)
    const csvData = []
    $('div.chatlog__embed-content').each((i, elem) => {
        const usernameElement = $(elem).find('a.chatlog__embed-author-name-link')
        const username = usernameElement.text().trim()
        const user_id = usernameElement.attr('href').trim().replace('https://r6tab.com/', '')
        const fields = $(elem).find('div.chatlog__embed-field')
        const reason = $(fields[0]).find('div.chatlog__embed-field-value').text().trim()
        const timestamp = $(fields[1]).find('div.chatlog__embed-field-value').text().trim()
        csvData.push({
            uplay: username,
            uplay_id: user_id,
            reason: reason,
            timestamp: timestamp,
        })
    })
    writer.writeRecords(csvData).then(() => {
        console.log('CSV Data Written')
    })
})
