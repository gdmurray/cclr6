export const features = {
    registration: false,
    login: false,
    profile: false
}

export const featureUrls: Record<string, string[]> = {
    registration: ['/team/register', '/register'],
    login: ['/login'],
    profile: ['/profile']
}

export const Features = {
    isRouteValid: (url): boolean => {
        return !Object.keys(features).filter(
            (f) => !features[f]
        ).map((feature) => {
            return featureUrls[feature].some((val) => url.startsWith(val))
        }).some(val => val)
    }
}