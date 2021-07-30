import React, { useContext, useEffect, useReducer } from 'react'
import TeamLayout from '@components/teams/layout'
import PlayerForm from '@components/teams/players/Form'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { TeamContext } from '@components/teams/teamContext'
import { Teams } from '@lib/models/team'
import { basePlayers, IPlayer, Players } from '@lib/models/player'
import Loader from '@components/Loader'
import { InvitationProvider } from '@components/teams/invitationContext'
import { useToast } from '@chakra-ui/react'
import { resetServerContext } from 'react-beautiful-dnd'

const url = '/team/players'

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
    referral: url,
})(async () => {
    resetServerContext()
    return {
        props: {},
    }
})

type State = {
    players: any[]
    loading: boolean
    error?: string
}

type Action =
    | { type: 'loading' }
    | { type: 'update'; players: IPlayer[] }
    | { type: 'success'; players: any[] }
    | { type: 'failure'; error?: string }

function mergePlayers(players, updated) {
    const indexMap = updated.reduce((acc: Record<number, IPlayer>, doc) => {
        acc[doc.index] = doc
        return acc
    }, {})

    for (let i = 0; i < players.length; i += 1) {
        if (i in indexMap) {
            players[i] = { ...players[i], ...indexMap[i] }
        }
    }
    return players
}

export type LockState = {
    locked: boolean
    loading: boolean
    message: string
}

type LockAction = { type: 'loading' } | { type: 'update'; locked: boolean; message: string }

function lockReducer(state: LockState, action: LockAction): LockState {
    switch (action.type) {
        case 'loading':
            return {
                ...state,
                loading: true,
            }
        case 'update':
            return {
                loading: false,
                locked: action.locked,
                message: action.message,
            }
    }
}

function playerReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'loading':
            return {
                ...state,
                loading: true,
            }

        case 'update':
            return {
                ...state,
                players: [...mergePlayers(state.players, action.players)],
            }

        case 'success':
            return {
                loading: false,
                players: action.players,
                error: undefined,
            }
        case 'failure':
            return {
                ...state,
                loading: false,
                error: undefined,
            }
    }
}

function TeamPlayers(): JSX.Element {
    const teamContext = useContext(TeamContext)
    const toast = useToast({ duration: 1000, position: 'top-right' })
    const { team } = teamContext
    const [state, dispatch] = useReducer(playerReducer, { loading: true, players: [] })
    const [lockState, lockDispatch] = useReducer(lockReducer, { loading: true, locked: true, message: '' })
    useEffect(() => {
        lockDispatch({ type: 'loading' })
        fetch('/api/team/players/locked', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            response.json().then((res) => {
                const { status, message } = res
                lockDispatch({ type: 'update', locked: status === 'locked', message })
            })
        })
    }, [])

    useEffect(() => {
        dispatch({ type: 'loading' })
        Teams.getPlayers(team.id).then((result) => {
            const indexMap = Players.getPlayerIndexMap(result)
            const players = basePlayers.map((elem, idx) => {
                if (idx in indexMap) {
                    return {
                        ...elem,
                        ...indexMap[idx],
                    }
                }
                return elem
            })
            dispatch({ type: 'success', players })
        })
    }, [])

    if (state.loading || lockState.loading) {
        return (
            <div>
                <Loader text="Loading Players" />
            </div>
        )
    }

    const playerCallback = (updatedPlayers, players) => {
        dispatch({ type: 'update', players: updatedPlayers })

        fetch('/api/team/players/update', {
            method: 'POST',
            body: JSON.stringify(players),
            headers: {
                'Content-Type': 'applicaton/json',
            },
        }).then((res) => {
            if (res.ok) {
                toast({
                    status: 'success',
                    title: 'Updated Tournament Registration',
                })
            }
        })
    }
    const { players } = state
    return (
        <InvitationProvider team={team}>
            <PlayerForm lockState={lockState} players={players} callback={playerCallback} />
        </InvitationProvider>
    )
}

TeamPlayers.SEO = {
    title: 'Team Players',
    url,
}

TeamPlayers.layout = (content: React.ReactNode): JSX.Element => {
    return <TeamLayout>{content}</TeamLayout>
}
export default TeamPlayers
