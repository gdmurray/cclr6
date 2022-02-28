import { useRouter } from 'next/router'
import { CreateTeamClient, ITeam } from '@lib/models/team'
import React, { useContext, useEffect, useState } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { Season } from '@lib/models/season'
import { PaymentContext, PurchaseTarget } from '@components/teams/PaymentContext'
import { motion } from 'framer-motion'

interface IPaymentForm {
    season: Season
    team: ITeam
}

export default function PaymentForm({ season, team }: IPaymentForm): JSX.Element {
    const router = useRouter()
    const teamClient = CreateTeamClient(team)
    const [completed, setCompleted] = useState<boolean>(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_o, setOrderId] = useState('')
    const [paypalError, setPaypalError] = useState('')

    const { purchaseEvent, isPurchasing, paymentInProgress, setPaymentInProgress } = useContext(PaymentContext)

    const createOrder = (data, actions) => {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: purchaseEvent.target === PurchaseTarget.SINGLE_QUALIFIER ? 50 : 80,
                        },
                    },
                ],
                application_context: {
                    shipping_preference: 'NO_SHIPPING',
                },
            })
            .then((orderId) => {
                setPaymentInProgress(true)
                setOrderId(orderId)
                return orderId
            })
    }
    const onApprove = (data, actions) => {
        return actions.order
            .capture()
            .then(async (details) => {
                await teamClient.purchasePass(purchaseEvent.id, details)
                fetch('/api/team/purchase', {
                    method: 'POST',
                    body: JSON.stringify({ team_id: team.id, event_name: purchaseEvent.name, details: details }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => {
                        return
                    })
                    .finally(() => {
                        setPaymentInProgress(false)
                        setCompleted(true)
                    })
            })
            .catch((err) => {
                setPaypalError(`Error Processing Payment: ${err.message}`)
            })
    }

    const onCancel = () => {
        setPaymentInProgress(false)
    }

    useEffect(() => {
        if (completed) {
            setTimeout(() => {
                router.reload()
            }, 2500)
        }
    }, [completed])

    const variants = {
        open: { height: 'auto', opacity: 1 },
        closed: { height: '0', opacity: 0 },
    }
    console.log('payment in progresS: ', paymentInProgress)
    return (
        <motion.div
            animate={isPurchasing ? 'open' : 'closed'}
            variants={variants}
            className="py-4 px-6 bg-gray-50 rounded-xl border border-gray-600"
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-gray-800 text-lg font-bold tracking-tight pb-2">
                {purchaseEvent.name}{' '}
                <span className="text-gray-600 text-sm">
                    {purchaseEvent.target === PurchaseTarget.SEASON_PASS ? 'Qualifier Pass' : 'Individual Qualifier'}
                </span>
            </div>
            <div className="text-error font-semibold text-sm">{paypalError}</div>
            {completed && (
                <>
                    <div className="font-heavy text-gray-800 font-semibold text-2xl text-center">
                        Thank You for Purchasing!
                        <br /> We look forward to seeing you in the Quals.
                    </div>
                    <div className="text-center text-sm tracking-tight text-gray-600 font-medium">
                        Refreshing Page...
                    </div>
                </>
            )}
            {!completed && (
                <>
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
                            layout: 'vertical',
                        }}
                    />
                    <div className="text-gray-800 font-medium tracking-tight text-center text-sm">
                        Unable to use paypal? Email us at{' '}
                        <a className="text-link" href={`mailto:support@cclr6.com?subject=Payment for ${season.name}`}>
                            support@cclr6.com
                        </a>{' '}
                        for assistance.
                    </div>
                </>
            )}
        </motion.div>
    )
}
