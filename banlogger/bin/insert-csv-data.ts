import dayjs from 'dayjs'

const customParseFormat = require('dayjs/plugin/customParseFormat')
const csv = require('csv-parser')
const fs = require('fs')
const client = require('@prisma/client')

dayjs.extend(customParseFormat)
const prisma = new client.PrismaClient()

async function main() {
    const insert_data = []
    fs.createReadStream('bans.csv')
        .pipe(csv())
        .on('data', async (row) => {
            if (row.uplay.length <= 16) {
                const timestamp = dayjs(
                    row.timestamp.trim(),
                    ['D/M/YYYY, HH:mm:ss', 'D/M/YYYY, h:mm:ss A', 'DD/MM/YYYY, H:mm:ss'],
                    false
                ).toISOString()
                const payload = {
                    ...row,
                    timestamp,
                }
                insert_data.push(payload)
            }
        })
        .on('end', async () => {
            const totalLength = insert_data.length
            let processed = 0
            while (insert_data.length > 0) {
                const batchData = insert_data.splice(0, 1000)
                processed += batchData.length
                console.log(`Inserting ${batchData.length} Rows`)
                await prisma.bannedUser.createMany({
                    data: batchData,
                })
                console.log(
                    `${((processed / totalLength) * 100).toFixed(2)}% Inserted... ${processed} processed, ${
                        totalLength - processed
                    } left `
                )
            }
            console.log('finished data load')
        })
}

main()
    .catch((err) => {
        console.log('ERROR: ', err)
    })
    .finally(async () => await prisma.$disconnect())
