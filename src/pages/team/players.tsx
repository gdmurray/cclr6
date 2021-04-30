import React, { useContext, useEffect, useReducer } from 'react'
import TeamLayout from '@components/teams/layout'
import PlayerForm from '@components/teams/players/Form'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { TeamContext } from '@components/teams/teamContext'
import { Teams } from '@lib/models/team'
import { basePlayers, IPlayer } from '@lib/models/player'
import Loader from '@components/Loader'

const url = '/team/players'

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
    referral: url
})({})

type State = {
    players: any[];
    loading: boolean;
    error?: string;
}

type Action =
    | { type: 'loading', }
    | { type: 'success', players: any[] }
    | { type: 'failure', error?: string }

function playerReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'loading':
            return {
                ...state,
                loading: true
            }
        case 'success':
            return {
                loading: false,
                players: action.players,
                error: undefined
            }
        case 'failure':
            return {
                ...state,
                loading: false,
                error: undefined
            }
    }
}

function Players(): JSX.Element {
    const teamContext = useContext(TeamContext)
    const { team, user } = teamContext
    const [state, dispatch] = useReducer(playerReducer, { loading: true, players: [] })

    useEffect(() => {
        dispatch({ type: 'loading' })
        Teams.getPlayers(team.id).then((result) => {
            const indexMap = result.docs.reduce((acc: Record<number, IPlayer>, doc) => {
                const data = { id: doc.id, ...doc.data() } as IPlayer
                acc[data.index] = data
                return acc
            }, {})
            const players = basePlayers.map((elem, idx) => {
                if (idx in indexMap) {
                    return {
                        ...elem,
                        ...indexMap[idx]
                    }
                }
                return elem
            })
            dispatch({ type: 'success', players })
        })
    }, [])

    if (state.loading) {
        return (<div>
                <Loader text='Loading Players' />
            </div>
        )
    }
    const { players } = state
    return (
        <PlayerForm players={players} />
    )
}

Players.SEO = {
    title: 'Team Players',
    url
}

Players.layout = (content: React.ReactNode): JSX.Element => {
    return <TeamLayout>{content}</TeamLayout>
}
export default Players