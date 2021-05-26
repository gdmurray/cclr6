import { Invitation } from '@lib/models/invitations'
import React, { createContext, useContext, useEffect, useState } from 'react'
import db from '@lib/firebase/firestore'
import { ITeam } from '@lib/models/team'
import { TeamContext } from '@components/teams/teamContext'
import { useToast } from '@chakra-ui/react'


interface IInvitationContext {
    invitations: Invitation[];
    loading: boolean;
    inviteUser: (event: React.MouseEvent<HTMLButtonElement>, email: string) => void
    getInvitation: (email: string) => Invitation | null
}

export const InvitationContext = createContext<IInvitationContext>({
    invitations: [],
    loading: true,
    inviteUser: (event, email) => {
    },
    getInvitation: (email) => {
        return null
    }
})

interface InvitationProviderProps {
    children: React.ReactNode;
    team: ITeam;
}

export const useInvitations = () => {
    return useContext(InvitationContext)
}

function useTeamInvitations({ team }) {
    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const toast = useToast({ position: 'top-right', duration: 2000, variant: 'solid' })

    const fetchInvitations = () => {
        db.collection('invitations')
            .where('team_id', '==', team.id)
            .get()
            .then((result) => {
                if (result.size > 0) {
                    const data = result.docs.map((elem) => ({
                        id: elem.id,
                        ...elem.data() as Invitation
                    }))
                    setInvitations(data)
                }
                setLoading(false)
            })
    }

    useEffect(() => {
        if (team) {
            fetchInvitations()
        }
    }, [team])

    const getInvitation = (email): Invitation | null => {
        if (!loading) {
            const invitationsWithEmail = invitations.filter((elem) => elem.email === email)
            if (invitationsWithEmail.length > 0) {
                if (invitationsWithEmail.length === 1) {
                    return invitationsWithEmail[0]
                }
            }
        }
        return null
    }

    const inviteUser = async (e, email) => {
        e.preventDefault()
        const response = await fetch('/api/team/invite', {
            method: 'POST',
            body: JSON.stringify({
                team_id: team.id,
                team_name: team.name,
                user_email: email
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        toast({
            title: `Invited ${email}`,
            status: 'success'
        })
    }

    return {
        invitations,
        loading,
        inviteUser,
        getInvitation
    }
}

export const InvitationProvider = (props: InvitationProviderProps) => {
    const { team, children } = props
    const invitations = useTeamInvitations({ team })

    return <InvitationContext.Provider value={invitations}>
        {props.children}
    </InvitationContext.Provider>
}

