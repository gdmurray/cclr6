export interface BaseParticipant {
    id: string
    name: string
    custom_user_identifier: string
    custom_fields: Record<string, any>
}

export interface Opponent {
    number: number
    position: number
    participant: BaseParticipant
    rank: number | null
    result: number | null
    forfeit: false
    score: number | null
}

export interface Round {
    id: string
    stage_id: string
    group_id: string
    number: number
    name: string
    closed: boolean
    settings: Record<string, any>
    tournament_id: string
}

export interface Ranking {
    properties: {
        score_for: number
        score_against: number
        score_difference: number
        wins: number
        draws: number
        losses: number
        played: number
        forfeits: number
    }
    id: string
    tournament_id: string
    stage_id: string
    group_id: string
    number: number
    position: number
    ranking: number | null
    points: number | null
    participant: {
        id: string
        name: string
        custom_user_identifier: string
        custom_fields: Record<string, any>
    }
}

export interface Match {
    id: string
    scheduled_datetime: string | null
    public_note: string | null
    private_note: string | null
    status: string
    stage_id: string
    group_id: string
    round_id: string
    number: number
    type: string
    settings: Record<string, any>
    played_at: string | null
    report_closed: boolean
    tournament_id: string
    opponents: Opponent[]
}
