import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import AdminLayout from '@components/admin/layout'
import React, { useRef, useState } from 'react'
import { SeasonOne } from '@lib/models/season'
import { ToornamentClient } from '@lib/api/toornament'
import Table from 'rc-table'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import { FaCheck, FaChevronCircleRight, FaTimes } from 'react-icons/fa'
import { useRouter } from 'next/router'
import { adminFireStore } from '@lib/firebase/admin'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Code,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Tournament } from '@lib/models/tournament'
import { IPayment } from '@lib/models/payment'

dayjs.extend(LocalizedFormat)

export const getServerSideProps = withAuthSSR({
    whenNotAdmin: AuthAction.REDIRECT_TO_APP,
})(async () => {
    const season = SeasonOne
    const client = new ToornamentClient()
    const qualifiers = []
    for (let i = 0; i < season.qualifiers.length; i += 1) {
        const { id } = season.qualifiers[i]
        const qual = await client.getTournament(id)
        qualifiers.push(qual)
    }

    const allPayments = await adminFireStore.collectionGroup('payments').where('season', '==', '1').get()

    const paymentMap = allPayments.docs.reduce((acc: Record<string, any>, doc) => {
        const teamId = doc.ref.path.split('/')[1]
        acc[teamId] = {
            id: doc.id,
            ...doc.data(),
        }
        return acc
    }, {})

    const teams = await adminFireStore.collection('teams').get()

    const payments = teams.docs.map((team) => ({
        id: team.id,
        ...team.data(),
        ...(team.id in paymentMap
            ? { has_paid: true, payment: { ...paymentMap[team.id] } }
            : {
                  has_paid: false,
                  payment: {},
              }),
    }))

    return {
        props: {
            qualifiers,
            payments,
        },
    }
})

const QualifierTable = ({ qualifiers }: { qualifiers: Tournament[] }) => {
    const { push } = useRouter()
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Date',
            dataIndex: 'scheduled_date_start',
            key: 'scheduled_date_start',
        },
        {
            title: 'Reg Open',
            dataIndex: 'registration_opening_datetime',
            key: 'registration_opening_datetime',
            render: (val) => {
                return <>{dayjs(val).format('LLL')}</>
            },
        },
        {
            title: 'Reg Closed',
            dataIndex: 'registration_closing_datetime',
            key: 'registration_closing_datetime',
            render: (val) => {
                return <>{dayjs(val).format('LLL')}</>
            },
        },
        {
            title: 'Players',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (val) => {
                return (
                    <>
                        <FaChevronCircleRight
                            className="cursor-pointer"
                            onClick={() => push(`/admin/season/${val.id}`)}
                        />
                    </>
                )
            },
        },
    ]

    return (
        <div>
            <h2 className="page-title-sm">Qualifiers</h2>
            <Table rowKey={(record) => record.id} className="data-table" columns={columns} data={qualifiers} />
        </div>
    )
}

interface TeamPayment {
    name: string
    id: string
    contact_email: string
    has_paid: boolean
    payment: IPayment
}

const PaymentCell = ({ record }: { record: TeamPayment }): JSX.Element => {
    const { reload } = useRouter()
    const toast = useToast({ variant: 'solid', duration: 2500 })
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { register, handleSubmit } = useForm()
    const cancelRef = useRef(null)
    const [isCodeOpen, setIsCodeOpen] = useState<boolean>(false)
    const onSubmit = (values) => {
        console.log(values)
        fetch('/api/admin/payments/create', {
            method: 'POST',
            body: JSON.stringify({
                team_id: record.id,
                payment_url: values.payment_url,
                email_address: values.email_address || record.contact_email,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => {
            if (result.ok) {
                toast({
                    status: 'success',
                    title: `Registered Payment for ${record.name}`,
                    onCloseComplete: () => {
                        reload()
                    },
                })
            }
        })
    }

    if (!record.has_paid) {
        return (
            <div>
                <Button onClick={onOpen}>Manual Payment</Button>
                <Modal isOpen={isOpen} onClose={onClose} colorScheme="gray">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create Payment</ModalHeader>
                        <ModalCloseButton />
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalBody>
                                <FormControl>
                                    <FormLabel>Team Name</FormLabel>
                                    <Input variant="" isReadOnly={true} value={record.name} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Payment Link</FormLabel>
                                    <Input {...register('payment_url')} type="text" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Email Address</FormLabel>
                                    <Input {...register('email_address')} type="email" />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" colorScheme="blue" mr={4}>
                                    Create
                                </Button>
                                <Button>Cancel</Button>
                            </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>
            </div>
        )
    }
    return (
        <div>
            <Button onClick={() => setIsCodeOpen(true)}>Payment</Button>
            <AlertDialog
                leastDestructiveRef={cancelRef}
                isOpen={isCodeOpen}
                onClose={() => setIsCodeOpen(false)}
                size="lg"
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Payment Info</AlertDialogHeader>
                        <AlertDialogBody>
                            <Code>
                                <pre>{JSON.stringify(record.payment, null, '\t')}</pre>
                            </Code>
                        </AlertDialogBody>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    )
}

const PaymentTable = ({ payments }: { payments: TeamPayment[] }) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Contact Email',
            dataIndex: 'contact_email',
            key: 'contact_email',
        },
        {
            title: 'Has Paid',
            dataIndex: 'has_paid',
            key: 'has_paid',
            render: (has_paid: boolean) => {
                return has_paid ? <FaCheck className="text-success" /> : <FaTimes className="text-error" />
            },
        },
        {
            title: 'Payment',
            dataIndex: 'payment',
            key: 'payment',
            render: (_payment, record) => {
                return <PaymentCell record={record} />
            },
        },
    ]

    return (
        <div>
            <h2 className="page-title-sm">Payments</h2>
            <Table className="data-table" columns={columns} data={payments} rowKey={(elem) => elem.id} />
        </div>
    )
}

interface IAdminSeason {
    qualifiers: Tournament[]
    payments: TeamPayment[]
}

const AdminSeason = ({ qualifiers, payments }: IAdminSeason) => {
    return (
        <div className="space-y-2">
            <QualifierTable qualifiers={qualifiers} />
            <PaymentTable payments={payments} />
        </div>
    )
}

AdminSeason.layout = (content: React.ReactNode): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}

export default AdminSeason
