import { useRouter } from 'next/router'
import { CreateTeamClient } from '@lib/models/team'
import React, { useEffect, useState } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'

export default function PaymentForm({ season, team, inProgress, setProgress }): JSX.Element {

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
                            value: 40
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
                            layout: 'vertical'
                        }} />
                    <div className='text-gray-800 font-medium tracking-tight text-center text-sm'>
                        Unable to use paypal? Email us at <a className='text-link'
                                                             href={`mailto:support@cclr6.com?subject=Payment for ${season.name}`}>support@cclr6.com</a> for
                        assistance.
                    </div>
                </>
            )}
        </div>
    )
}