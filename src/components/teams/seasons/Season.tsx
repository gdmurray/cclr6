import React, { useContext, useEffect, useState } from 'react'
import { FaCalendarAlt, FaRegCreditCard, FaTimes, FaTrophy } from 'react-icons/fa'
import dayjs from 'dayjs'
import { Button, useToast } from '@chakra-ui/react'
import { SeasonClient } from '@lib/models/season'
import { TeamContext } from '@components/teams/teamContext'
import { CreateTeamClient, IRegistration } from '@lib/models/team'
import { useRouter } from 'next/router'
import useEligibility from '@components/teams/seasons/Eligibility'
import { CreateTournamentClient } from '@lib/models/tournament'
import Loader from '@components/Loader'
import PaymentForm from '@components/teams/Payment'


export default function SeasonComponent({ season }): JSX.Element {
    const seasonClient = SeasonClient(season)
    const [isPurchasing, setIsPurchasing] = useState<boolean>(false)
    const [teamPaid, setTeamPaid] = useState<boolean>(false)
    const [paymentInProgress, setPaymentInProgress] = useState<boolean>(false)

    const teamContext = useContext(TeamContext)
    const { team, user } = teamContext

    const teamClient = CreateTeamClient(team)

    const getButtonContent = () => {
        if (isPurchasing) {
            return (<>Cancel Purchase&nbsp;<FaTimes /></>)
        }
        return <>Purchase Pass&nbsp;<FaRegCreditCard /></>
    }

    const handlePaymentClick = () => {
        if (!paymentInProgress) {
            setIsPurchasing(!isPurchasing)
        }
    }

    useEffect(() => {
        teamClient.hasTeamPaid('1').then((result) => {
            setTeamPaid(result)
        })
    }, [])

    const { eligibility, eligibilityChecklist, loading } = useEligibility({ team, user, season })

    return (
        <div className='bordered border rounded-xl'>
            <div className='flex flex-col w-full p-4 h-full z-10 relative'>
                <div className='flex-1 flex flex-row justify-between'>
                    <div>
                        <div className='text-main font-heavy text-2xl md:text-3xl font-bold'>
                            {season.name}
                        </div>
                        <div className='mt-1'>
                            <div className='font-semibold text-alt text-sm'>Date</div>
                            <div className='flex flex-row items-center text-alt-2 font-medium text-sm'>
                                This is where the description would go
                                {/*<FaCalendarAlt />&nbsp;{dayjs(tournament.scheduled_date_start).format('LL')}&nbsp;&nbsp;-&nbsp;&nbsp;{dayjs(tournament.scheduled_date_end).format('LL')}*/}
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        {!teamPaid && (
                            <Button colorScheme={isPurchasing ? 'red' : 'green'}
                                    onClick={handlePaymentClick}>{getButtonContent()}</Button>
                        )}
                        {eligibilityChecklist()}
                    </div>
                </div>
                {isPurchasing && (
                    <PaymentForm season={season}
                                 team={team}
                                 inProgress={paymentInProgress}
                                 setProgress={setPaymentInProgress} />
                )}
                {
                    !seasonClient.hasStarted() && (
                        <div className='mt-4'>
                            <div className='font-semibold text-main pb-1'>Qualifiers</div>
                            <div
                                className={`p-2 bordered border-2 rounded-xl space-y-2 ${eligibility?.eligible ? '' : 'disabled'}`}>
                                {loading && (
                                    <Loader text='Loading Qualifiers' />
                                )}
                                {!loading && (season.qualifiers.map((qualifier) => {
                                    return <Qualifier key={qualifier.id} qualifier={qualifier}
                                                      eligibility={eligibility} />
                                }))}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

function Qualifier({ qualifier, eligibility }): JSX.Element {
    const teamContext = useContext(TeamContext)
    const { team, user } = teamContext
    const teamClient = CreateTeamClient(team)
    const tournamentClient = CreateTournamentClient(qualifier)
    const [status, setStatus] = useState<{
        message: string,
        disabled: boolean,
        button: string;
        status: 'success' | 'default' | 'error'
    }>({
        message: '',
        disabled: true,
        button: 'Register',
        status: 'default'
    })

    const router = useRouter()
    const toast = useToast({ position: 'top-right', duration: 2000, variant: 'solid' })

    const getRegistrationStatus = (): void => {
        if (eligibility) {
            if (!eligibility.eligible) {
                setStatus({
                    disabled: true,
                    message: eligibility.reason,
                    button: 'Register',
                    status: 'default'
                })
                return
            }

            if (!tournamentClient.isRegistrationOpen()) {
                if (tournamentClient.hasRegistrationClosed()) {
                    setStatus({
                        disabled: true,
                        message: `Registration Closed ${dayjs(qualifier.registration_closing_datetime).format('LLL')}`,
                        button: 'Closed',
                        status: 'error'
                    })
                    return
                }
                if (!tournamentClient.hasRegistrationStarted()) {
                    setStatus({
                        disabled: true,
                        message: (`Registration Opens ${dayjs(qualifier.registration_opening_datetime).format('LLL')}`),
                        button: 'Register',
                        status: 'default'
                    })
                    return
                }
            }

            teamClient.hasTeamRegistered(qualifier.id).then(registered => {
                if (registered) {
                    setStatus({
                        disabled: true,
                        message: `Registered on ${dayjs((registered as IRegistration).registered).format('LLL')}`,
                        button: 'Registered',
                        status: 'success'
                    })
                    return
                } else {
                    setStatus({
                        disabled: false,
                        message: 'Open for Registration!',
                        button: 'Register',
                        status: 'default'
                    })
                    return
                }
            })

        }
    }

    useEffect(() => {
        getRegistrationStatus()
    }, [eligibility])

    const handleRegister = async (tournament) => {
        teamClient.hasTeamRegistered(tournament.id).then((hasRegistered) => {
            if (!hasRegistered) {
                fetch(`/api/toornament/${tournament.id}/register`, {
                    method: 'POST',
                    body: JSON.stringify({
                        team_id: team.id
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }

                }).then((result) => {
                    result.json().then(data => {
                        if (data.status === 'success') {
                            toast({
                                title: `Registered for ${tournament.name}`,
                                status: 'success',
                                onCloseComplete: () => {
                                    router.reload()
                                }
                            })
                        }
                    })
                })
            }
        })
    }

    const getStatusColor = (status) => {
        if (status === 'default') {
            return 'text-alt-2'
        }
        if (status === 'success') {
            return 'text-success'
        }
        if (status === 'error') {
            return 'text-error'
        }
    }
    return (
        <div key={qualifier.id}
             className='flex flex-col space-y-1 md:space-y-0 md:flex-row flex-row items-center justify-between p-2 border-b last:border-b-0'>
            <div className='text-line w-full justify-between'>
                <div
                    className='text-line font-medium text-lg tracking-tight'>
                    <FaTrophy />&nbsp;{qualifier.id.length > 1 ?
                    <a target='_blank' rel='noopener' className="hover:underline transition-all duration-150" href={`https://www.toornament.com/en_US/tournaments/${qualifier.id}/information`}>{qualifier.name}</a> : qualifier.name}
                </div>
                <div style={{ width: '110px' }} className='text-line justify-between font-medium tracking-tight'>
                    <FaCalendarAlt />&nbsp;{qualifier.scheduled_date_start}
                </div>
            </div>
            <div className='flex w-full justify-between md:justify-end space-x-2'>
                <div
                    className={`text-xs font-semibold tracking-tight text-line ${getStatusColor(status.status)}`}>
                    {status.message}
                </div>
                <Button isDisabled={status.disabled} size='md'
                        onClick={() => handleRegister(qualifier)}> {status.button}</Button>
            </div>
        </div>
    )
}

//isDisabled={!canTeamRegister()}