const fs = require('fs')
const crypto = require('crypto')

const algorithm = 'aes-256-ctr'
export const iv = crypto.randomBytes(16)

const secretName = process.argv[2]
const filename = process.argv[3]
const secret = process.argv[4]

const encrypt = (text, secret) => {
    const cipher = crypto.createCipheriv(algorithm, secret, iv)

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex'),
    }
}

fs.readFile(`./${filename}`, 'utf-8', function (err, content) {
    const fileString = JSON.stringify(JSON.parse(content))
    const encrypted = encrypt(fileString, secret)
    fs.writeFileSync(
        `./secrets/${secretName}.enc.js`,
        `
module.exports = {
    encrypted: "${encrypted.content}"
}
    `
    )
    console.log('SECRET: ', secret)
    console.log('IV: ', encrypted.iv)
})
