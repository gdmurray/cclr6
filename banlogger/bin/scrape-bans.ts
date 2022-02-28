const dayjs = require('dayjs')

const { Client } = require('pg')
const { Builder, By, WebElement } = require('selenium-webdriver')

const client = new Client({
    user: 'admin',
    host: 'localhost',
    password: 'password',
    database: 'twitter',
    port: 5469,
})

client.on('error', (err) => {
    console.error('Error on client: ', err)
})
// until % 3
// A2022 - 02 - 24

// q=until%3A2022-02-10

async function processTweet(elem: typeof WebElement) {
    try {
        const tweetBody = await elem.findElement(By.xpath('.//div//div//div/div[2]/div[2]'))
        const upperBody = await tweetBody.findElement(By.xpath('./div/div/div/div[1]'))
        const tweetContent = await tweetBody.findElement(By.xpath('./div[2]/div'))
        const { players, reason } = await processTweetContent(tweetContent)
        const { tweetId, timestamp } = await processTweetHeader(upperBody)

        for (const player of players) {
            await client.query(`
                INSERT INTO banned_user(uplay, reason, timestamp, tweet_id)
                VALUES ('${player}', '${reason}', '${timestamp}', ${tweetId})
                ON CONFLICT DO NOTHING
            `)
        }
        return players
    } catch (err) {
        console.log('ERROR PROCESSING TWEET: ', err)
    }
}

async function processTweetContent(elem: typeof WebElement): Promise<{
    players: string[]
    reason: string
}> {
    const tweetText = await elem.getText()
    const tweetLines = tweetText
        .split('\n')
        .filter((elem) => elem !== '')
        .map((elem) => elem.trim())
    // Remove element
    tweetLines.shift()
    let banReason = ''
    try {
        banReason = tweetLines.pop().split(':').pop()
    } catch (err) {
        console.log('Ban Reason failed to pop: ', tweetLines)
    }
    return {
        players: tweetLines.map((elem) => elem.replace('http://', '')),
        reason: banReason,
    }
}

async function processTweetHeader(elem: typeof WebElement) {
    const timeElement = await elem.findElement(By.css('time'))
    const tweetURLAnchor = await elem.findElement(By.xpath('.//a[@dir="auto" and @role="link"]'))
    const tweetURL = await tweetURLAnchor.getAttribute('href')
    const tweetId = tweetURL.split('/').pop().trim()
    const timestamp = await timeElement.getAttribute('datetime')
    return {
        tweetId,
        timestamp,
    }
}

async function refreshToLatest(driver) {
    const oldestFetched = await client.query(`
        SELECT banned_user.timestamp
        FROM banned_user
        ORDER BY timestamp
            FETCH FIRST 1 ROW ONLY;
    `)
    const oldestTimestamp = oldestFetched.rows[0].timestamp
    const query = encodeURIComponent(`+until:${dayjs(oldestTimestamp).add(1, 'day').format('YYYY-MM-DD')}`)
    return fetchUsers(driver, query)
}

async function fetchUsers(driver, query = '') {
    await driver.get(`https://mobile.twitter.com/search?q=from%3ABanLogger${query}&src=typed_query&f=live`)
    await driver.sleep(4000)
    const tweetContainer = await driver.findElement(By.xpath('//section[@role="region"]//div'))
    const tweets = await tweetContainer.findElements(By.css('article'))
    const tweetQueue = [...tweets]
    let currentElement = null
    let previousLength = tweets.length
    let lastPlayers = []
    let currentPlayers = []
    try {
        do {
            currentElement = tweetQueue.shift()
            const players = await processTweet(currentElement)
            currentPlayers.push(...players)
            // Reset point, when queue has been emptied
            if (tweetQueue.length === 0) {
                const { x, y } = await currentElement.getRect()
                await driver.executeScript(`return window.scrollTo('${x}', '${y}');`)
                await driver.sleep(500)
                const nextTweets = await driver.findElements(By.css('article'))
                console.log('Next Length: ', nextTweets.length)
                // tweetQueue = nextTweets.splice(0, previousLength)
                tweetQueue.push(...nextTweets)
                console.log('Previous Length: ', previousLength)
                console.log('Process length: ', tweetQueue.length)
                previousLength = tweetQueue.length

                // Not the first run
                if (lastPlayers.length > 0) {
                    if (lastPlayers[0] === currentPlayers[0]) {
                        console.log('Refreshing..: ', lastPlayers[0], currentPlayers[0])
                        return refreshToLatest(driver)
                    }
                }
                lastPlayers = currentPlayers
                currentPlayers = []
            }
        } while (tweetQueue.length != 0)
    } catch (err) {
        console.log('Refreshing to latest due to: ', err.message)
        console.log(err)
        return refreshToLatest(driver)
    }
}

// df6c0a27b5b1ee75057ef752803a9df6a16177e5
client.connect().then(async () => {
    const driver = await new Builder().forBrowser('chrome').build()
    try {
        console.log('Connected to postgresql client')
        await driver.get('https://mobile.twitter.com/search?q=from%3ABanLogger&src=typed_query&f=live')
        await driver.manage().addCookie({ name: 'auth_token', value: 'df6c0a27b5b1ee75057ef752803a9df6a16177e5' })
        const oldestFetched = await client.query(`
            SELECT banned_user.timestamp
            FROM banned_user
            ORDER BY timestamp
                FETCH FIRST 1 ROW ONLY;
        `)
        const oldestTimestamp = oldestFetched.rows[0].timestamp
        const query = encodeURIComponent(`+until:${dayjs(oldestTimestamp).add(1, 'day').format('YYYY-MM-DD')}`)
        await fetchUsers(driver, query)
    } catch (err) {
        console.log('ERROR: ', err)
        console.log(err)
        await driver.quit()
    }
})

console.log('Script running')
