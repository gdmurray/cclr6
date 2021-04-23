export const isLocal = () => {
    return process.env.NODE_ENV !== 'production'
}

const remoteAddr = process.env.VERCEL_URL ? process.env.VERCEL_URL : 'https://cclr6.com'

export const host = isLocal() ? 'http://localhost:3001' : remoteAddr