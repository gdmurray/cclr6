import { CreateTournamentClient, Tournament } from '@lib/models/tournament'
import { IEligibility } from '@components/teams/seasons/Eligibility'
import React, { useContext, useEffect, useState } from 'react'
import { TeamContext } from '@components/teams/teamContext'
import { CreateTeamClient, IRegistration } from '@lib/models/team'
import { Season } from '@lib/models/season'
import { useRouter } from 'next/router'
import { Button, Tooltip, useToast } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { FaCalendarAlt, FaLock, FaLockOpen, FaTimes, FaTrophy, FaUsers } from 'react-icons/fa'
import { PaymentContext, PurchaseTarget } from '@components/teams/PaymentContext'
import { useUnregister } from '@components/teams/seasons/useUnregister'

type QualifierProps = {
    qualifier: Tournament
    eligibility: IEligibility
    season: Season
}

export function Qualifier({ qualifier, eligibility, season }: QualifierProps): JSX.Element {
    const teamContext = useContext(TeamContext)
    const [participants, setParticipants] = useState<[]>([])
    const { team } = teamContext
    const teamClient = CreateTeamClient(team)
    const tournamentClient = CreateTournamentClient(qualifier)

    const { isPurchasing, handlePaymentClick, teamPurchases } = useContext(PaymentContext)

    useEffect(() => {
        if (qualifier.id) {
            if (qualifier.id.length > 1) {
                fetch(`/api/qualifier/${qualifier.id}/participants`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((response) => {
                    response.json().then((res) => {
                        setParticipants(res.participants)
                    })
                })
            }
        }
    }, [qualifier])

    const [status, setStatus] = useState<{
        message: string
        disabled: boolean
        button: string
        status: 'success' | 'default' | 'error'
    }>({
        message: '',
        disabled: true,
        button: 'Register',
        status: 'default',
    })

    const router = useRouter()
    const toast = useToast({ position: 'top-right', duration: 2000, variant: 'solid' })

    const getRegistrationStatus = (): void => {
        if (eligibility) {
            // console.log(eligibility)
            if (!eligibility.eligible) {
                if (!eligibility.teamQualified.satisfied) {
                    setStatus({
                        disabled: true,
                        message: eligibility.reason,
                        button: 'Qualified',
                        status: 'success',
                    })
                    return
                } else {
                    setStatus({
                        disabled: true,
                        message: eligibility.reason,
                        button: 'Register',
                        status: 'default',
                    })
                    return
                }
            }

            teamClient.hasQualified().then((qualified) => {
                if (qualified) {
                    console.log(qualified)
                } else {
                    teamClient.hasTeamRegistered(qualifier.id).then((registered) => {
                        if (registered) {
                            setStatus({
                                disabled: true,
                                message: `Registered on ${dayjs((registered as IRegistration).registered).format(
                                    'MMM D'
                                )}`,
                                button: 'Registered',
                                status: 'success',
                            })
                            return
                        } else {
                            if (!tournamentClient.isRegistrationOpen()) {
                                console.log(qualifier.registration_closing_datetime)
                                if (tournamentClient.hasRegistrationClosed()) {
                                    setStatus({
                                        disabled: true,
                                        message: `Registration Closed ${dayjs(
                                            qualifier.registration_closing_datetime
                                        ).format('MMM D [at] h:mm A')}`,
                                        button: 'Closed',
                                        status: 'error',
                                    })
                                    return
                                } else if (!tournamentClient.hasRegistrationStarted()) {
                                    setStatus({
                                        disabled: true,
                                        message: `Registration Opens ${dayjs(
                                            qualifier.registration_opening_datetime
                                        ).format('MMM D [at] h:mm A')}`,
                                        button: 'Register',
                                        status: 'default',
                                    })
                                    return
                                } else {
                                    setStatus({
                                        disabled: true,
                                        message: `The event has concluded, stay tuned for the next qualifier`,
                                        button: 'Event Over',
                                        status: 'default',
                                    })
                                    return
                                }
                            } else {
                                if (participants.length == qualifier.size) {
                                    setStatus({
                                        disabled: true,
                                        message: 'Qualifier full!',
                                        button: 'Full',
                                        status: 'default',
                                    })
                                    return
                                }
                                setStatus({
                                    disabled: false,
                                    message: 'Open for Registration!',
                                    button: 'Register',
                                    status: 'default',
                                })
                                return
                            }
                        }
                    })
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
                fetch(`/api/qualifier/${tournament.id}/register`, {
                    method: 'POST',
                    body: JSON.stringify({
                        team_id: team.id,
                        event_name: tournament.name,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((result) => {
                    result.json().then((data) => {
                        console.log('DATA: ', data)
                        if (data.status === 'success') {
                            toast({
                                title: `Registered for ${tournament.name}`,
                                status: 'success',
                                onCloseComplete: () => {
                                    router.replace(router.asPath)
                                },
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

    const { UnregisterDialog, canUnregister, onUnregisterOpen, hover } = useUnregister({ team, qualifier, status })

    const QualifierActionButton = (): JSX.Element => {
        if (isPurchasing) {
            return (
                <Button
                    colorScheme={isPurchasing || !season.active ? 'red' : 'green'}
                    onClick={() =>
                        handlePaymentClick({
                            target: PurchaseTarget.SINGLE_QUALIFIER,
                            id: qualifier.id,
                            name: qualifier.full_name,
                        })
                    }
                >
                    <>
                        Cancel&nbsp;
                        <FaTimes />
                    </>
                </Button>
            )
        }

        // If they purchased a full pass : disable
        // If they purchased that pass : disable
        if (status.disabled === false && !hasPaid())
            return (
                <Tooltip label={`Pass grants you access to ${qualifier.name}`} hasArrow>
                    <Button
                        onMouseEnter={hover.handleHover}
                        onMouseLeave={hover.handleHover}
                        colorScheme={isPurchasing || !season.active ? 'red' : 'green'}
                        onClick={() =>
                            handlePaymentClick({
                                target: PurchaseTarget.SINGLE_QUALIFIER,
                                id: qualifier.id,
                                name: qualifier.full_name,
                            })
                        }
                    >
                        {hover.isHovering ? <>$50.00 CAD</> : <>&nbsp;&nbsp;&nbsp;Purchase&nbsp;&nbsp;</>}
                    </Button>
                </Tooltip>
            )

        if (canUnregister()) {
            return (
                <Button
                    onClick={onUnregisterOpen}
                    onMouseEnter={hover.handleHover}
                    onMouseLeave={hover.handleHover}
                    size="md"
                >
                    {hover.isHovering ? 'Unregister?' : <>&nbsp;Registered&nbsp;</>}
                </Button>
            )
        }

        return (
            <Button isDisabled={status.disabled} size="md" onClick={() => handleRegister(qualifier)}>
                {status.button}
            </Button>
        )
    }

    function hasPaid(): boolean {
        return (
            teamPurchases.findIndex((elem) => elem.season === 's2p1') !== -1 ||
            teamPurchases.findIndex((elem) => elem.season === qualifier.id) !== -1
        )
    }

    return (
        <>
            <div
                key={qualifier.id}
                className="flex flex-col space-y-1 md:space-y-0 md:flex-row flex-row items-center justify-between p-2 border-b last:border-b-0"
            >
                <UnregisterDialog />
                <div className="text-line w-full justify-between">
                    <div className="text-line font-medium text-lg tracking-tight">
                        <FaTrophy />
                        &nbsp;
                        {qualifier.id.length > 1 ? (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline transition-all duration-150"
                                // href={`https://www.toornament.com/en_US/tournaments/${qualifier.id}/information`}
                            >
                                {qualifier.name}
                            </a>
                        ) : (
                            qualifier.name
                        )}
                        <span
                            onClick={() => router.push(`/seasons/two/teams?sid=${qualifier.id}`)}
                            className="mx-2 text-alt-2 text-sm font-medium flex flex-row items-center hover:underline cursor-pointer"
                        >
                            <FaUsers />
                            &nbsp;{participants.length}/{qualifier.size}
                        </span>
                    </div>
                    <div
                        style={{ width: '110px' }}
                        className="text-line justify-between font-medium tracking-tight whitespace-nowrap"
                    >
                        <FaCalendarAlt />
                        &nbsp;{qualifier.scheduled_date_start}
                    </div>
                </div>
                <div className="flex w-full justify-between md:justify-end space-x-2">
                    <div className={`text-xs font-semibold tracking-tight text-line ${getStatusColor(status.status)}`}>
                        {status.message} &nbsp;
                        {hasPaid() ? (
                            <Tooltip label={'This Qualifier has been purchased'} placement={`left`}>
                                <span>
                                    <FaLockOpen />
                                </span>
                            </Tooltip>
                        ) : (
                            <Tooltip label={'This qualifier has not been paid for'} placement={`left`}>
                                <span>
                                    <FaLock />
                                </span>
                            </Tooltip>
                        )}
                    </div>
                    <QualifierActionButton />
                </div>
            </div>
        </>
    )
}
