import { useEffect, useState } from 'react'
import { ITeam, Teams } from '@lib/models/team'

interface UseTeam {
    team: ITeam | null;
    loading: boolean;
    setTeam: (team: ITeam) => void
}

export default function useTeam({ user }): UseTeam {
    const [team, setTeam] = useState<ITeam | null>(undefined)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        const fetchTeam = async () => {
            const foundTeam = await Teams.getTeamByUserID(user.uid)
            setTeam(foundTeam)
            setLoading(false)
        }
        if (user && team === undefined) {
            fetchTeam()
        }
    }, [user])

    return {
        team,
        loading,
        setTeam
    }
}