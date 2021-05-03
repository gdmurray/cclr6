import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { FaCalendarAlt, FaRegCreditCard, FaTimes, FaTrophy } from 'react-icons/fa'
import dayjs from 'dayjs'
import { Button, toast, useToast } from '@chakra-ui/react'
import { SeasonClient } from '@lib/models/season'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { TeamContext } from '@components/teams/teamContext'
import { CreateTeamClient, IRegistration } from '@lib/models/team'
import { useRouter } from 'next/router'
import Eligibility from '@components/teams/seasons/Eligibility'
import useEligibility from '@components/teams/seasons/Eligibility'
import { CreateTournamentClient } from '@lib/models/tournament'


function PaymentForm({ season, team, inProgress, setProgress }): JSX.Element {

    const router = useRouter()
    const teamClient = CreateTeamClient(team)
    const [completed, setCompleted] = useState<boolean>(false)
    const [orderId, setOrderId] = useState('')
    const [paypalError, setPaypalError] = useState('')

    const createOrder = (data, actions) => {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: 25
                        }
                    }
                ],
                application_context: {
                    shipping_preference: 'NO_SHIPPING'
                }
            }).then((orderId) => {
                setProgress(true)
                setOrderId(orderId)
                return orderId
            })
    }
    const onApprove = (data, actions) => {
        return actions.order.capture().then(async (details) => {
            await teamClient.purchasePass(season.id, details)
            setProgress(false)
            setCompleted(true)
        }).catch(err => {

            setPaypalError(`Error Processing Payment: ${err.message}`)
        })
    }

    const onCancel = (data, actions) => {
        setProgress(false)
    }

    useEffect(() => {
        if (completed) {
            setTimeout(() => {
                router.reload()
            }, 2500)
        }
    }, [completed])

    return (
        <div className='py-4 px-6 bg-gray-50 rounded-xl border border-gray-600'>
            <div className='text-gray-800 text-lg font-bold tracking-tight pb-2'>{season.name} <span
                className='text-gray-600 text-sm'>Qualifiers Payment</span></div>
            <div className='text-error font-semibold text-sm'>{paypalError}</div>
            {completed && (
                <>
                    <div className='font-heavy text-gray-800 font-semibold text-2xl text-center'>Thank You for
                        Purchasing!<br /> We look forward to seeing you in the Quals.
                    </div>
                    <div className='text-center text-sm tracking-tight text-gray-600 font-medium'>Refreshing Page...
                    </div>
                </>)}
            {!completed && (
                <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}

                    onCancel={onCancel}
                    style={{
                        color: 'gold',
                        height: 40,
                        shape: 'pill',
                        label: 'pay',
                        tagline: false,
                        layout: 'vertical'
                    }} />
            )}
        </div>
    )
}

// const PaypalButton = paypal.Buttons.driver('react', { React, ReactDOM })
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

    const { eligibility, eligibilityChecklist } = useEligibility({ team, user, season })

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
                                {season.qualifiers.map((qualifier) => {
                                    return <Qualifier key={qualifier.id} qualifier={qualifier}
                                                      eligibility={eligibility} />
                                })}
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
    const toast = useToast({ position: 'top-right', duration: 2000 })

    const getRegistrationStatus = (): void => {
        if (eligibility) {
            if (!eligibility.eligible) {
                setStatus({
                    disabled: true,
                    message: eligibility.reason,
                    button: 'Register',
                    status: 'default'
                })
            }
            if (!tournamentClient.isRegistrationOpen()) {
                if (tournamentClient.hasRegistrationClosed()) {
                    setStatus({
                        disabled: true,
                        message: `Registration Closed ${dayjs(qualifier.registration_closing_datetime).format('LLL')}`,
                        button: 'Closed',
                        status: 'error'
                    })
                }
                if (!tournamentClient.hasRegistrationStarted()) {
                    setStatus({
                        disabled: true,
                        message: (`Registration Opens ${dayjs(qualifier.registration_opening_datetime).format('LLL')}`),
                        button: 'Register',
                        status: 'default'
                    })
                }
            } else {
                teamClient.hasTeamRegistered(qualifier).then(registered => {
                    if (registered) {
                        setStatus({
                            disabled: true,
                            message: `Registered on ${dayjs((registered as IRegistration).registered.toDate()).format('LLL')}`,
                            button: 'Registered',
                            status: 'success'
                        })
                    }
                })
            }

        }
    }

    useEffect(() => {
        getRegistrationStatus()
    }, [eligibility])

    const handleRegister = async (tournament) => {
        teamClient.hasTeamRegistered(tournament).then((hasRegistered) => {
            if (!hasRegistered) {
                teamClient.registerForTournament(tournament).then((registration) => {
                    if (registration) {
                        toast({
                            title: `Registered for ${tournament.name}`,
                            status: 'success',
                            onCloseComplete: () => {
                                router.reload()
                            }
                        })
                    }
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
                    <FaTrophy />&nbsp;{qualifier.name}</div>
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