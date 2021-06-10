export interface Invitation {
    id: string
    team_id: string
    team_name: string
    email_address: string
    status: string
    expires: string
}

export enum InvitationState {
    INVALID = 'INVALID',
    EXPIRED = 'EXPIRED',
}
