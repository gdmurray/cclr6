import { NextApiRequest, NextApiResponse } from 'next'
import { adminFireStore } from '@lib/firebase/admin'


async function fixPayment(doc): Promise<boolean> {
    const teamId = doc.ref.path.split('/')[1]
    const paymentId = doc.id
    const paymentData = doc.data()
    if (!('type' in paymentData)) {
        if (Object.keys(paymentData.payment).length === 8) {
            // Paypal payment!
            const updated = await adminFireStore
                .collection('teams')
                .doc(teamId)
                .collection('payments')
                .doc(paymentId)
                .update({ type: 'paypal' })
            // this is where we'd update ({type: "manual"})
        } else {
            // Regular object, bigger update
            const body = {
                payment: {
                    create_time: '',
                    status: 'COMPLETED',
                    payer: {
                        email_address: '',
                        payer_id: ''
                    },
                    links: [
                        {
                            href: ''
                        }
                    ],
                    purchase_units: [
                        {
                            amount: {
                                currency_code: 'CAD',
                                value: '40.00'
                            }
                        }
                    ]
                },
                type: 'MANUAL'
            }
            const teamData = await adminFireStore.collection('teams').doc(teamId).get()

            const updated = await adminFireStore
                .collection('teams')
                .doc(teamId)
                .collection('payments')
                .doc(paymentId)
                .update(body)
            console.log(teamData.data())
            console.log('DEFAULT:', paymentData)
        }
        // if(Object.keys(paymentData.payment).length )
    }
    return Promise.resolve(true)
}

export default async function fix(req: NextApiRequest, res: NextApiResponse) {
    const valid = false
    if (valid) {
        const payments = await adminFireStore
            .collectionGroup('payments')
            .get()

        Promise.all(payments.docs.map(elem => fixPayment(elem))).then((results) => {
            console.log(results)
        })

        res.status(200).end()
    } else {
        res.status(401).end()
    }
}