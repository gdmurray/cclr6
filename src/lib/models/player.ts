export interface IPlayer {
    id?: string
    index: number
    email: string
    country: 'CA' | 'USA'
    uplay: string
    uid?: string
    is_captain: boolean
    twitter?: string
    twitch?: string
}

export const basePlayers = [
    {
        required: true,
    },
    {
        required: true,
    },
    {
        required: true,
    },
    {
        required: true,
    },
    {
        required: true,
    },
    {
        required: false,
    },
    {
        required: false,
    },
]
