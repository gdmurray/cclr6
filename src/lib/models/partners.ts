import partners from '../../assets/partners.json'

type Partner = {
    readonly name: string;
    readonly links: {
        twitter?: string;
        website?: string;
    },
    readonly description: string;
    readonly image: string;
}

export default partners as Partner[]