import React, { useContext, useEffect, useState } from 'react'
import TeamLayout from '@components/teams/layout'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { CreateTournamentClient, Tournament } from '@lib/models/tournament'
import { data as tournaments } from '@components/teams/mockToornament'
import { TeamContext } from '@components/teams/teamContext'
import { FaBan, FaCalendarAlt, FaCheck, FaGamepad, FaStop, FaStopCircle, FaTrophy } from 'react-icons/fa'
import { motion } from 'framer-motion'
import EmptyState from '@components/EmptyState'
import {
    Button,
    Popover,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
    Tooltip
} from '@chakra-ui/react'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CreateTeamClient } from '@lib/models/team'

dayjs.extend(LocalizedFormat)

const url = '/team/registration'
// TODO: Toggle the eligibility check by first checking if the tournament is even active lmao
// TODO: this is where we'd fetch some information from toornaments api... when we have access
export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
    referral: url
})(async ({ user }) => {
    // async function getData() {
    //     return new Promise<Tournament[]>((resolve) => {
    //         setTimeout(() => resolve(tournaments), 300)
    //     })
    // }
    //
    // const res = await getData()
    return {
        props: {
            tournaments
        }
    }
})

// Different States
/*
First check if EVENT has ended
    1. Registration has not opened yet
    2. Registration is Open
    3. Registration has closed
 */

interface RegistrationStatus {
    active: boolean;
    reason: string;
}

let base = {
    eligible: true,
    reason: '-',
    registration: {
        satisfied: true,
        message: 'Registration is Closed'
    },
    teamRegistered: {
        satisfied: true,
        message: 'Team is not Registered'
    },
    userPermissions: {
        satisfied: true,
        message: 'User not Allowed to Register'
    },
    playerCount: {
        satisfied: true,
        message: 'Team does not have at least 5 Players'
    },
    playerCountry: {
        satisfied: true,
        message: 'Team is not at least 3/5 Canadian'
    },
    paymentSatisfied: {
        satisfied: true,
        message: 'Team has not paid yet'
    }
}

interface RegistrationCondition {
    satisfied: boolean;
    message: string;
}

interface Eligibility {
    eligible: boolean;
    reason: string;
    registration: RegistrationCondition;
    teamRegistered: RegistrationCondition;
    userPermissions: RegistrationCondition;
    playerCount: RegistrationCondition;
    playerCountry: RegistrationCondition;
    paymentSatisfied: RegistrationCondition;
}

const TournamentDetails = ({ children, tournament }): JSX.Element => {
    return (
        <div className='bordered border rounded-xl h-52 overflow-hidden'>
            <div className='flex flex-row w-full p-4 h-full z-10 relative'>
                <div className='flex-1 flex flex-col justify-between'>
                    <div>
                        <div className='text-main font-heavy text-2xl md:text-3xl font-bold'>
                            {tournament.full_name}
                        </div>
                        <div className='mt-1'>
                            <div className='font-semibold text-alt text-sm'>Schedule</div>
                            <div className='flex flex-row items-center text-alt-2 font-medium text-sm'>
                                <FaCalendarAlt />&nbsp;{dayjs(tournament.scheduled_date_start).format('LL')}&nbsp;&nbsp;-&nbsp;&nbsp;{dayjs(tournament.scheduled_date_end).format('LL')}
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
                <div className='flex flex-col justify-between'>
                    {children}
                </div>
            </div>
        </div>
    )
}

function TournamentRegistration({ tournament }: { tournament: Tournament }): JSX.Element {
    const { push } = useRouter()
    const teamContext = useContext(TeamContext)
    const { team, user } = teamContext

    const client = CreateTournamentClient(tournament)
    const teamClient = CreateTeamClient(team)

    const [eligibility, setEligibility] = useState<Eligibility>()

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
            console.log('CAN TEAM REGISTER... ASYNC SHIT')

            let checks = { ...base }

            function not(key) {
                checks.eligible = false
                checks[key].satisfied = false
                return checks
            }

            // Registration Not Open
            if (!client.isRegistrationOpen()) {
                checks = not('registration')
            }

            // Has Team Registered
            const registered = await teamClient.hasTeamRegistered(tournament)
            if (registered) {
                checks = not('teamRegistered')
                if (checks.reason === '-') {
                    checks.reason = eligibility.teamRegistered.message
                }
            }

            if (!(teamClient.canUserRegister(user.uid))) {
                checks = not('userPermissions')
                if (checks.reason === '-') {
                    checks.reason = eligibility.userPermissions.message
                }
            }

            // Min Players
            const minimumPlayers = await teamClient.hasMinimumPlayers()
            console.log('Minimum PlayerS: ', minimumPlayers)
            if (!minimumPlayers) {
                checks = not('playerCount')
                if (checks.reason === '-') {
                    checks.reason = eligibility.playerCount.message
                }
            }

            // Min Canadians
            const minCanadians = await teamClient.hasMinimumCanadians()
            if (!minCanadians) {
                checks = not('playerCountry')
                if (checks.reason === '-') {
                    checks.reason = eligibility.playerCountry.message
                }
            }

            console.log(checks)
            setEligibility(checks)
        }
        canTeamRegister()

    }, [])


    const getRegistrationStatus = (): JSX.Element => {
        if (client.isRegistrationOpen()) {
            return <>Registration is Open <FaCheck className='ml-1 text-success' /></>
        }
        return <>Registration is Closed <FaBan className='ml-1 text-error' /></>
    }


    const getEligibilityText = (eligibility: Eligibility) => {
        if (eligibility.eligible) {
            if (eligibility.registration.satisfied) {
                return <>Register</>
            } else {
                return <>Registered</>
            }
        } else {
            return <>Register <FaBan className='ml-2' /></>
        }
    }

    if (eligibility === undefined) {
        return (
            <TournamentDetails tournament={tournament}>
                <div>Loading</div>
            </TournamentDetails>
        )
    }

    const getRegistrationDetails = (): { text: string, date: string } => {
        if (!client.hasRegistrationStarted()) {
            return {
                text: 'Registration Opens on:',
                date: tournament.registration_opening_datetime
            }
        }

        if (client.hasRegistrationClosed()) {
            return { text: 'Registration Closed on:', date: tournament.registration_closing_datetime }
        }

        if (client.isRegistrationOpen()) {
            return { text: 'Registration Ends on:', date: tournament.registration_closing_datetime }
        }
    }

    const registrationDetails = getRegistrationDetails()

    return (
        <TournamentDetails tournament={tournament}>
            <div className='flex flex-col text-right'>
                <Tooltip label={eligibility.reason} placement='top' isDisabled={eligibility.eligible}>
                    <Button
                        colorScheme='gray'
                    >
                        {getEligibilityText(eligibility)}
                    </Button>
                </Tooltip>
                <div className='mt-2 text-right flex flex-col items-end space-y-1'>
                    <div className='registration-detail'>
                        {getRegistrationStatus()}
                    </div>
                    {eligibility.playerCountry.satisfied ?
                        (<div className='registration-detail'>
                            Team is not 3/5 Canadian <FaCheck className='ml-1 text-success' />
                        </div>)
                        :
                        (<div className='registration-detail cursor-pointer hover:underline '
                              onClick={() => push('/team/players')}>
                            Team is not 3/5 Canadian <FaBan className='ml-1 text-error' />
                        </div>)
                    }
                    {eligibility.paymentSatisfied.satisfied ?
                        (<div className='registration-detail'>
                            Payment was Made <FaCheck className='ml-1 text-success' />
                        </div>) :
                        (
                            <div className='registration-detail cursor-pointer hover:underline '
                                 onClick={() => push('/team/payments')}>
                                Payment Not Made <FaBan className='ml-1 text-error' />
                            </div>
                        )
                    }
                </div>
            </div>
            <div className='text-sm text-right'>
                <div className='font-semibold text-alt '>{registrationDetails.text}</div>
                <div
                    className='font-normal text-alt-2'>{dayjs(registrationDetails.date).format('LLL')}</div>
            </div>
        </TournamentDetails>
    )
}

// linear-gradient(180deg, #00000065 40%, #ffffff10 100%)
interface IRegistration {
    tournaments: Tournament[]
}

function Registration({ tournaments }: IRegistration): JSX.Element {
    return (
        <>
            {tournaments.length === 0 && (
                <EmptyState icon={<FaTrophy />} text={'No Tournaments Found!'} />
            )}
            <div className={'max-w-4xl mx-auto items-center'}>
                {tournaments.map((tournament) => {
                    return (
                        <TournamentRegistration key={tournament.id} tournament={tournament} />
                    )
                })}
            </div>

        </>
    )
}

Registration.SEO =
    {
        title: 'Team Registration',
        url
    }

Registration.layout = (content: React.ReactNode): JSX.Element => {
    return <TeamLayout>{content}</TeamLayout>
}
export default Registration


// <motion.div
// className='max-w-lg z-0'
// whileHover={{
//     scale: 1.1,
//         transition: { duration: 0.6 }
// }}
// style={{
//     // boxShadow: '#00000030 -19px 0px 1em 10px inset',
//     // boxShadow: "inset 0 0 4em 1em #000",
//     position: 'relative',
//         top: '-100%',
//         cursor: 'pointer',
//         width: '35%',
//         height: '100%',
//         overflow: 'hidden',
//         background: `linear-gradient(to right, #1C191780, #44403C70, #00000090), url('${tournament.logo.original}')`,
//         backgroundRepeat: 'repeat-x, no-repeat',
//         backgroundSize: 'contain, cover',
//         backgroundPosition: 'center'
// }} />