export interface IPlayer {
    id?: string;
    index: number;
    email: string;
    country: 'CA' | 'USA';
    uplay: string;
    uid?: string;
    is_captain: boolean;
}

export const basePlayers = [
    {
        required: true
    },
    {
        required: true
    },
    {
        required: true
    },
    {
        required: true
    },
    {
        required: true
    },
    {
        required: false
    }
]