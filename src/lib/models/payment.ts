export interface IPayment {
    type: 'paypal' | 'manual'
    season: string
    payment: Record<any, any>
}
