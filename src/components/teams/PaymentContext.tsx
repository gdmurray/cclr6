import React, { useEffect, useState } from 'react'
import { CreateTeamClient, ITeam } from '@lib/models/team'

type PaymentContext = {
    isPurchasing: boolean
    purchaseEvent: PurchaseEvent | null
    teamPaid: boolean
    teamPurchases: any[]
    paymentInProgress: boolean
    setPaymentInProgress: React.Dispatch<boolean>
    handlePaymentClick: (event: PurchaseEvent) => void
}
export const PaymentContext = React.createContext<PaymentContext>({
    isPurchasing: false,
    purchaseEvent: null,
    teamPaid: false,
    teamPurchases: [],
    paymentInProgress: false,
    handlePaymentClick: () => null,
    setPaymentInProgress: () => null,
})

export enum PurchaseTarget {
    SEASON_PASS = 'SEASON_PASS',
    SINGLE_QUALIFIER = 'SINGLE_QUALIFIER',
}

type PurchaseEvent = {
    target: PurchaseTarget
    id: string
    name: string
}

type PaymentProviderProps = {
    children: React.ReactNode
    team: ITeam | null
}

export const PaymentProvider = ({ children, team }: PaymentProviderProps): JSX.Element => {
    const [isPurchasing, setIsPurchasing] = useState<boolean>(false)
    const [purchaseEvent, setPurchaseEvent] = useState<PurchaseEvent | null>(null)
    const [teamPaid, setTeamPaid] = useState<boolean>(false)
    const [teamPurchases, setTeamPurchases] = useState<any[]>([])
    const [paymentInProgress, setPaymentInProgress] = useState<boolean>(false)
    const [teamClient, setTeamClient] = useState(null)

    useEffect(() => {
        setTeamClient(CreateTeamClient(team))
    }, [team])

    const handlePaymentClick = (event: PurchaseEvent) => {
        if (!paymentInProgress) {
            setPurchaseEvent(event)
            setIsPurchasing(!isPurchasing)
        }
    }

    useEffect(() => {
        // TODO: Make this better... need information of WHAT the team has paid for
        if (teamClient != null) {
            teamClient.getPaymentsStartingWith('s2p1').then((result) => {
                const results = result.map((elem) => elem.data())
                setTeamPurchases(results)
            })
        }
    }, [teamClient])

    return (
        <PaymentContext.Provider
            value={{
                isPurchasing,
                paymentInProgress,
                teamPaid,
                handlePaymentClick,
                purchaseEvent,
                setPaymentInProgress,
                teamPurchases,
            }}
        >
            {children}
        </PaymentContext.Provider>
    )
}
