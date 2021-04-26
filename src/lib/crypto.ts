import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const FIREBASE_KEY = 'HRfFS:@z2r9kM>2_<ijf~z=HH#-VkCZu'
const GOOGLE_KEY = 's9nF~XU1ec:b2M><~pH8lVJxLwuBz.0!'
const iv = crypto.randomBytes(16)

export const decrypt = (hash, secret) => {

    const decipher = crypto.createDecipheriv(algorithm, secret, Buffer.from(hash.iv, 'hex'))

    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

    return decrypted.toString()
}
