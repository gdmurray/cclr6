import { useRouter } from 'next/router'
import { CreateTeamClient } from '@lib/models/team'
import React, { useEffect, useState } from 'react'
import { FaBan, FaCheck } from 'react-icons/fa'
import { IPayment } from '@lib/models/payment'

const baseConditions = {
    eligible: true,
    reason: '-',
    userPermissions: {
        satisfied: true,
        message: 'User not Allowed to Register',
    },
    playerCount: {
        satisfied: true,
        message: 'Team does not have at least 5 Players',
    },
    playerCountry: {
        satisfied: true,
        message: 'Team is not at least 3/5 Canadian',
    },
    paymentSatisfied: {
        satisfied: true,
        message: 'Team has not paid yet',
    },
    teamQualified: {
        satisfied: true,
        message: 'Team has Qualified!',
    },
}

interface RegistrationCondition {
    satisfied: boolean
    message: string
}

export interface IEligibility {
    eligible: boolean
    reason: string
    // teamRegistered: RegistrationCondition;
    userPermissions: RegistrationCondition
    playerCount: RegistrationCondition
    playerCountry: RegistrationCondition
    // paymentSatisfied: RegistrationCondition
    teamQualified: RegistrationCondition
}

function useEligibility({ team, user }) {
    const { push } = useRouter()
    const [loading, setLoading] = useState<boolean>(true)
    const teamClient = CreateTeamClient(team)
    const [eligibility, setEligibility] = useState<IEligibility>({ ...baseConditions })
    const [payments, setPayments] = useState<IPayment[]>([])
    useEffect(() => {
        const canTeamRegister = async (): Promise<void> => {
            /*
                Reasons why you cannot register
                1. Tournament hasnt started
                2. The Team has already registered
                3. The User has Permissions to register
                4. The team has at least 5 players
                5. At least 3/5 of those players are Canadian
                6. The Team has PAID
             */

            let checks = { ...eligibility }

            function not(key) {
                checks.eligible = false
                checks[key].satisfied = false
                return checks
            }

            if (!teamClient.canUserRegister(user.uid)) {
                checks = not('userPermissions')
                if (checks.reason === '-') {
                    checks.reason = baseConditions.userPermissions.message
                }
            }

            // Min Players
            const minimumPlayers = await teamClient.hasMinimumPlayers()
            if (!minimumPlayers) {
                checks = not('playerCount')
                if (checks.reason === '-') {
                    checks.reason = baseConditions.playerCount.message
                }
            }

            // Min Canadians
            const minCanadians = await teamClient.hasMinimumCanadians()
            if (!minCanadians) {
                checks = not('playerCountry')
                if (checks.reason === '-') {
                    checks.reason = baseConditions.playerCountry.message
                }
            }

            const teamPayments = await teamClient.getPaymentsStartingWith('s2p1')
            if (teamPayments.length != payments.length) {
                setPayments(teamPayments)
            }

            // const hasPaid = await teamClient.getPaymentsStartingWith('s2p1')
            // if (hasPaid.length === 0) {
            //     checks = not('paymentSatisfied')
            //     if (checks.reason === '-') {
            //         checks.reason = baseConditions.paymentSatisfied.message
            //     }
            // }

            const hasQualified = await teamClient.hasQualified()
            if (hasQualified) {
                checks = not('teamQualified')
                if (checks.reason === '-') {
                    checks.reason = baseConditions.teamQualified.message
                }
            }

            setEligibility(checks)
            setLoading(false)
        }
        canTeamRegister()
    }, [])

    const getEligibilityDetails = (): JSX.Element => {
        return (
            <>
                {!eligibility.teamQualified.satisfied ? (
                    <div className="registration-detail" aria-label="status-qualifications">
                        Team Qualified! <FaCheck className="ml-1 text-success" />
                    </div>
                ) : (
                    <>
                        {eligibility.playerCountry.satisfied ? (
                            <div className="registration-detail" aria-label="status-team">
                                Team is 3/5 Canadian <FaCheck className="ml-1 text-success" />
                            </div>
                        ) : (
                            <div
                                className="registration-detail cursor-pointer hover:underline"
                                aria-label="status-team"
                                onClick={() => push('/team/players')}
                            >
                                Team is not 3/5 Canadian <FaBan className="ml-1 text-error" />
                            </div>
                        )}
                        {payments.length === 0 ? (
                            <div className="registration-detail" aria-label="status-payment">
                                Payment Not Made <FaBan className="ml-1 text-error" />
                            </div>
                        ) : (
                            <div
                                className="registration-detail cursor-pointer hover:underline"
                                aria-label="status-payment"
                                onClick={() => push('/team/payments')}
                            >
                                Payment was Made <FaCheck className="ml-1 text-success" />
                            </div>
                        )}
                    </>
                )}
            </>
        )
    }

    const eligibilityChecklist = (): JSX.Element => {
        if (eligibility === undefined) {
            return <div className="text-sm">Checking Status...</div>
        }
        return (
            <div className="flex flex-col text-right">
                <div className="mt-2 text-right flex flex-col items-end space-y-1">{getEligibilityDetails()}</div>
            </div>
        )
    }

    return {
        eligibility,
        eligibilityChecklist,
        loading,
    }
}

// const getRegistrationDetails = (): { text: string, date: string } => {
//     if (!client.hasRegistrationStarted()) {
//         return {
//             text: 'Registration Opens on:',
//             date: tournament.registration_opening_datetime
//         }
//     }
//
//     if (client.hasRegistrationClosed()) {
//         return { text: 'Registration Closed on:', date: tournament.registration_closing_datetime }
//     }
//
//     if (client.isRegistrationOpen()) {
//         return { text: 'Registration Ends on:', date: tournament.registration_closing_datetime }
//     }
// }

// const registrationDetails = getRegistrationDetails()

// const getEligibilityText = (eligibility: IEligibility) => {
//     if (eligibility.eligible) {
//         if (eligibility.registration.satisfied) {
//             return <>Register</>
//         } else {
//             return <>Registered</>
//         }
//     } else {
//         return <>Register <FaBan className='ml-2' /></>
//     }
// }

export default useEligibility
