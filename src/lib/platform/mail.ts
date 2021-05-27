import config from './config'
import { isLocal } from '@lib/platform/env'

export const defaultLocals = {
    website: config.base_url,
    twitter: config.socials.twitter,
    twitch: config.socials.twitch,
    discord: config.socials.discord,
    contact_email: config.contact_email,
    year: new Date().getFullYear()
}

export const sendMail = async (req, emailAddress, template, variables): Promise<void> => {
    const response = await fetch(isLocal() ? 'http://localhost:5001/ccl-content/us-central1/triggerEmail' : 'https://us-central1-ccl-content.cloudfunctions.net/triggerEmail', {
        method: 'POST',
        body: JSON.stringify({
            template,
            emailAddress,
            variables: {
                ...defaultLocals,
                ...variables
            }
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${req.cookies.token}`
        }
    })
    const data = await response.json()
    return Promise.resolve()
}

