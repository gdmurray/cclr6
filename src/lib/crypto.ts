import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const iv = crypto.randomBytes(16)

export const decrypt = (hash, secret) => {

    const decipher = crypto.createDecipheriv(algorithm, secret, Buffer.from(hash.iv, 'hex'))

    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

    return decrypted.toString()
}
