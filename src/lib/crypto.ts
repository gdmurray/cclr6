import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const secretKey = process.env.SECRET_KEY
const iv = crypto.randomBytes(16)

export const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv)

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    }
}

export const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

    return decrpyted.toString()
}

// const secretBlob = {}
// fs.readdir('./secret', function(err, filenames) {
//     filenames.forEach(function(filename) {
//         fs.readFile(`./secret/${filename}`, 'utf-8', function(err, content) {
//             const fileString = JSON.stringify(JSON.parse(content))
//             const encrypted = encrypt(fileString)
//             fs.writeFileSync(`./secret/secret-${filename}.json`, JSON.stringify(encrypted))
//         })
//     })
// })
//
