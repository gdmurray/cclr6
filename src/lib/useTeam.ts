import { useEffect, useState } from 'react'
import { ITeam, Teams } from '@lib/models/team'

interface UseTeam {
    team: ITeam | null;
    loading: boolean;
}

export default function useTeam({ user }): UseTeam {
    const [team, setTeam] = useState<ITeam | null>(undefined)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        const fetchTeam = async () => {
            const userHasTeam = await Teams.getTeamByOwnerID(user.uid)
            if (userHasTeam) {
                const foundTeam = {
                    id: userHasTeam.id,
                    role: 'Owner',
                    ...userHasTeam.data() as ITeam
                }
                setTeam(foundTeam)
                setLoading(false)
            } else {
                setTeam(null)
                setLoading(false)
            }
        }
        if (user && team === undefined) {
            fetchTeam()
        }
    }, [user])

    return {
        team,
        loading
    }
}