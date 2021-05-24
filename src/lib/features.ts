import { isLocal } from '@lib/env'

interface IFeatures {
    registration: boolean;
    login: boolean;
    profile: boolean;
    invite: boolean;
}

export const defaultFeatures = {
    registration: true,
    login: true,
    profile: true,
    invite: true
}

const getFeatures = (): IFeatures => {
    // const DISABLED_FEATURES = process.env.DISABLED_FEATURES
    const DISABLED_FEATURES = isLocal() ? '' : 'login,registration,invite,profile'
    if (DISABLED_FEATURES) {
        try {
            const featureList = DISABLED_FEATURES.split(',').map((feature) => feature.trim())
            const allowedFeatures = Object.keys(defaultFeatures).reduce((acc, feature) => {
                if (featureList.indexOf(feature) !== -1) {
                    acc[feature] = false
                } else {
                    acc[feature] = defaultFeatures[feature]
                }
                return acc

            }, {})
            return allowedFeatures as IFeatures
        } catch (e) {
            console.log('error: ', e)
        }
    }
    return defaultFeatures
}

export const featureUrls: Record<string, string[]> = {
    registration: ['/team/register', '/register'],
    login: ['/login'],
    profile: ['/profile'],
    invite: ['/invitation']
}

export const Features = {
    isRouteValid: (url): boolean => {
        const allowedFeatures = getFeatures()
        return !Object.keys(allowedFeatures).filter(
            (f) => !allowedFeatures[f]
        ).map((feature) => {
            return featureUrls[feature].some((val) => url.startsWith(val))
        }).some(val => val)
    }
}
export const features = getFeatures()