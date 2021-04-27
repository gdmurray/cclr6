import { useEffect, useState } from 'react'
import { ITeam, Teams } from './firestore'

export default function useTeam({ user }) {
    const [team, setTeam] = useState<ITeam | null>(undefined)

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
            } else {
                setTeam(null)
            }
        }
        if (user && team === undefined) {
            fetchTeam()
        }
    }, [user])

    return {
        team
    }
}