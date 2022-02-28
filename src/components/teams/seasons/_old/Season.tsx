import React, { useContext, useEffect, useState } from 'react'
import { FaCalendarAlt, FaRegCreditCard, FaTimes, FaTrophy, FaUsers } from 'react-icons/fa'
import {
    Button,
    Tooltip,
    useDisclosure,
    useToast,
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogCloseButton,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogOverlay,
} from '@chakra-ui/react'
import { Season, SeasonClient } from '@lib/models/season'
import { TeamContext } from '@components/teams/teamContext'
import { CreateTeamClient, IRegistration } from '@lib/models/team'
import { useRouter } from 'next/router'
import useEligibility, { IEligibility } from '@components/teams/seasons/Eligibility'
import { CreateTournamentClient, Tournament } from '@lib/models/tournament'
import Loader from '@components/Loader'
import PaymentForm from '@components/teams/Payment'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'

dayjs.extend(LocalizedFormat)

export default function SeasonComponent({ season }: { season: Season }): JSX.Element {
    const seasonClient = SeasonClient(season)
    const [isPurchasing, setIsPurchasing] = useState<boolean>(false)
    const [teamPaid, setTeamPaid] = useState<boolean>(false)
    const [paymentInProgress, setPaymentInProgress] = useState<boolean>(false)

    const teamContext = useContext(TeamContext)
    const { team, user } = teamContext

    const teamClient = CreateTeamClient(team)

    const getButtonContent = () => {
        if (!season.active) {
            return <>Event Passed</>
        }
        if (isPurchasing) {
            return (
                <>
                    Cancel Purchase&nbsp;
                    <FaTimes />
                </>
            )
        }
        return (
            <>
                Purchase Pass&nbsp;
                <FaRegCreditCard />
            </>
        )
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
        <div className="bordered border rounded-xl">
            <div className="flex flex-col w-full p-4 h-full z-10 relative">
                <div className="flex-1 flex flex-row justify-between">
                    <div>
                        <div className="text-main font-heavy text-2xl md:text-3xl font-bold">
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline transition-all duration-150"
                                href={`https://www.toornament.com/en_US/tournaments/${season.toornamentId}/information`}
                            >
                                {season.name}
                            </a>
                        </div>
                        <div className="mt-1">
                            <div className="font-semibold text-alt text-sm">
                                Date:&nbsp;{dayjs(season.start_date).format('LL')}
                                &nbsp;-&nbsp;{dayjs(season.end_date).format('LL')}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {!teamPaid && (
                            <Tooltip label="Pass grants you access to all Qualifiers" hasArrow>
                                <Button
                                    colorScheme={isPurchasing || !season.active ? 'red' : 'green'}
                                    onClick={handlePaymentClick}
                                >
                                    {getButtonContent()}
                                </Button>
                            </Tooltip>
                        )}
                        {eligibilityChecklist()}
                    </div>
                </div>
                {isPurchasing && (
                    <PaymentForm
                        season={season}
                        team={team}
                        inProgress={paymentInProgress}
                        setProgress={setPaymentInProgress}
                    />
                )}
                {!seasonClient.hasStarted() && (
                    <div className="mt-4">
                        <div className="font-semibold text-main pb-1">Qualifiers</div>
                        <div
                            className={`p-2 bordered border-2 rounded-xl space-y-2 ${
                                eligibility?.eligible ? '' : 'disabled'
                            }`}
                        >
                            {loading && <Loader text="Loading Qualifiers" />}
                            {!loading &&
                                season.qualifiers.map((qualifier) => {
                                    return (
                                        <Qualifier
                                            key={qualifier.id}
                                            qualifier={qualifier as Tournament}
                                            eligibility={eligibility}
                                        />
                                    )
                                })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function Qualifier({ qualifier, eligibility }: { qualifier: Tournament; eligibility: IEligibility }): JSX.Element {
    const teamContext = useContext(TeamContext)
    const [participants, setParticipants] = useState<[]>([])
    const { team } = teamContext
    const teamClient = CreateTeamClient(team)
    const tournamentClient = CreateTournamentClient(qualifier)

    useEffect(() => {
        if (qualifier.id) {
            if (qualifier.id.length > 1) {
                fetch(`/api/toornament/${qualifier.id}/participants`, {
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
            console.log(eligibility)
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
                                    'MMMM D'
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
                                        ).format('MMMM D [at] h:mm A')}`,
                                        button: 'Closed',
                                        status: 'error',
                                    })
                                    return
                                } else if (!tournamentClient.hasRegistrationStarted()) {
                                    setStatus({
                                        disabled: true,
                                        message: `Registration Opens ${dayjs(
                                            qualifier.registration_opening_datetime
                                        ).format('MMMM D [at] h:mm A')}`,
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
                fetch(`/api/toornament/${tournament.id}/register`, {
                    method: 'POST',
                    body: JSON.stringify({
                        team_id: team.id,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((result) => {
                    result.json().then((data) => {
                        if (data.status === 'success') {
                            toast({
                                title: `Registered for ${tournament.name}`,
                                status: 'success',
                                onCloseComplete: () => {
                                    router.reload()
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

    const canUnregister = (): boolean => {
        return (
            dayjs(qualifier.registration_closing_datetime).diff(dayjs(), 'minutes') > 30 &&
            status.button === 'Registered'
        )
    }

    const [isHovering, setIsHovering] = useState<boolean>(false)

    const handleHover = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const { type } = e
        if (type === 'mouseenter') {
            if (!isHovering) {
                setIsHovering(true)
            }
        } else if (type === 'mouseleave') {
            if (isHovering) {
                setIsHovering(false)
            }
        }
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isUnregistering, setIsUnregistering] = useState<boolean>(false)
    const cancelRef = React.useRef<HTMLButtonElement>()

    const unregister = () => {
        setIsUnregistering(true)
        fetch(`/api/toornament/${qualifier.id}/unregister`, {
            method: 'POST',
            body: JSON.stringify({
                team_id: team.id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => {
            if (result.ok) {
                setIsUnregistering(false)
                onClose()
                toast({
                    status: 'info',
                    title: `Unregistered for ${qualifier.name}`,
                    onCloseComplete: () => {
                        router.reload()
                    },
                })
            } else {
                console.log('failed')
                setIsUnregistering(false)
                onClose()
                toast({
                    status: 'error',
                    title: 'There was an error unregistering',
                })
            }
        })
        // onClose()
    }
    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                isOpen={isOpen}
                onClose={onClose}
                leastDestructiveRef={cancelRef}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Confirm Unregister</AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody className="text-main font-normal">
                            Are you sure you want to unregister for <b>{qualifier.name}</b>,&nbsp; taking place on{' '}
                            <b>{dayjs(qualifier.scheduled_date_start).format('LL')}</b>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button isLoading={isUnregistering} colorScheme="red" ml={3} onClick={unregister}>
                                Unregister
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <div
                key={qualifier.id}
                className="flex flex-col space-y-1 md:space-y-0 md:flex-row flex-row items-center justify-between p-2 border-b last:border-b-0"
            >
                <div className="text-line w-full justify-between">
                    <div className="text-line font-medium text-lg tracking-tight">
                        <FaTrophy />
                        &nbsp;
                        {qualifier.id.length > 1 ? (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline transition-all duration-150"
                                href={`https://www.toornament.com/en_US/tournaments/${qualifier.id}/information`}
                            >
                                {qualifier.name}
                            </a>
                        ) : (
                            qualifier.name
                        )}
                        <span className="mx-2 text-alt-2 text-sm font-medium flex flex-row items-center">
                            <FaUsers />
                            &nbsp;{participants.length}/16
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
                        {status.message}
                    </div>
                    {!canUnregister() && (
                        <Button isDisabled={status.disabled} size="md" onClick={() => handleRegister(qualifier)}>
                            {' '}
                            {status.button}
                        </Button>
                    )}
                    {canUnregister() && (
                        <Button onClick={onOpen} onMouseEnter={handleHover} onMouseLeave={handleHover} size="md">
                            {isHovering ? 'Unregister?' : 'Registered'}
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}