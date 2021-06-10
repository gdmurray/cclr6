import dayjs from 'dayjs'
import { adminFireStore } from '@lib/firebase/admin'
import { ITeam } from '@lib/models/team'
import { InvitationState } from '@lib/models/invitations'

export default async function getInvitationProps<T extends { team_id: string; email_address: string; status: string }>(
    url,
    user,
    collection
): Promise<{
    props: {
        error: {
            status: InvitationState
            message: string
        } | null
        invitation: T | null
        user: any
    }
}> {
    try {
        const decoded = Buffer.from(decodeURI(url), 'base64').toString()
        const { id, expires } = JSON.parse(decoded)
        const expired = dayjs() >= dayjs(expires)
        if (expired) {
            return {
                props: {
                    error: {
                        status: InvitationState.EXPIRED,
                        message: 'Invitation has expired',
                    },
                    invitation: null,
                    user: user,
                },
            }
        }

        const record = await adminFireStore.collection(collection).doc(id).get()
        if (!record.exists) {
            return {
                props: {
                    error: {
                        status: InvitationState.INVALID,
                        message: 'Invalid Invite',
                    },
                    invitation: null,
                    user: user,
                },
            }
        }

        const data = { id, ...record.data() } as unknown as T
        const teamData = await adminFireStore.collection('teams').doc(data.team_id).get()
        if (!teamData.exists) {
            return {
                props: {
                    error: {
                        status: InvitationState.INVALID,
                        message: 'Invalid Invite',
                    },
                    invitation: null,
                    user: user,
                },
            }
        }

        const team = {
            id: data.team_id,
            ...teamData.data(),
        } as ITeam

        if (user.email !== data.email_address) {
            return {
                props: {
                    error: {
                        status: InvitationState.INVALID,
                        message: 'Invalid Invite',
                    },
                    invitation: null,
                    user: user,
                },
            }
        }

        if (data.status === 'CANCELLED' || data.status === 'ACCEPTED') {
            return {
                props: {
                    error: {
                        status: InvitationState.EXPIRED,
                        message: 'Invalid Invite',
                    },
                    invitation: null,
                    user: user,
                },
            }
        }

        if (data.status === 'PENDING') {
            return {
                props: {
                    error: null,
                    invitation: {
                        ...data,
                        team_logo: team.logo,
                        team_name: team.name,
                    },
                    user: user,
                },
            }
        }
    } catch (e) {
        return {
            props: {
                error: {
                    status: InvitationState.INVALID,
                    message: 'Invalid Invite',
                },
                invitation: null,
                user: user,
            },
        }
    }
}
