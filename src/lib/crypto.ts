import * as crypto from 'crypto'

const algorithm = 'aes-256-ctr'
// const iv = crypto.randomBytes(16)

export interface Hash {
    iv: string;
    content: string;
}

export const decrypt = (hash: Hash, secret: string): string => {

    const decipher = crypto.createDecipheriv(algorithm, secret, Buffer.from(hash.iv, 'hex'))

    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

    return decrypted.toString()
}
