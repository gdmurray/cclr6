import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import AdminLayout from '@components/admin/layout'
import React, { useRef, useState } from 'react'
import { SeasonTwoSplit1 } from '@lib/season'
// import { ToornamentClient } from '@lib/api/toornament'
import { Table } from 'antd'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import {
    FaCheck,
    FaChevronCircleRight,
    FaMinusSquare,
    FaPaypal,
    FaPlusSquare,
    FaRegEnvelope,
    FaTimes,
} from 'react-icons/fa'
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
import { createFilters } from '@lib/utils'
import { ColumnsType } from 'antd/es/table'
import { RenderExpandIconProps } from 'rc-table/es/interface'
// import { ITeam } from '@lib/models/team'

dayjs.extend(LocalizedFormat)

export const getServerSideProps = withAuthSSR({
    whenNotAdmin: AuthAction.REDIRECT_TO_APP,
})(async () => {
    // const season = SeasonOne
    // const client = new ToornamentClient()
    const qualifiers = SeasonTwoSplit1.qualifiers
    // for (let i = 0; i < season.qualifiers.length; i += 1) {
    //     const { id } = season.qualifiers[i]
    //     const qual = await client.getTournament(id)
    //     qualifiers.push(qual)
    // }

    const allPayments = await adminFireStore.collectionGroup('payments').where('season', '>=', 's2').get()

    const paymentMap = allPayments.docs.reduce((acc: Record<string, any>, doc) => {
        const teamId = doc.ref.path.split('/')[1]
        if (teamId in acc) {
            acc[teamId].push({
                id: doc.id,
                ...doc.data(),
            })
        } else {
            acc[teamId] = [
                {
                    id: doc.id,
                    ...doc.data(),
                },
            ]
        }

        return acc
    }, {})

    const teams = await adminFireStore.collection('teams').get()

    const payments = teams.docs.map((team) => ({
        id: team.id,
        ...team.data(),
        ...(team.id in paymentMap
            ? { has_paid: true, payments: [...paymentMap[team.id]] }
            : {
                  has_paid: false,
                  payments: [],
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
            <Table rowKey={(record) => record.id} columns={columns} dataSource={qualifiers} />
        </div>
    )
}

interface TeamPayment {
    name: string
    id: string
    contact_email: string
    has_paid: boolean
    payments: IPayment[]
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
                amount: values.amount,
                season: values.season,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => {
            if (result.ok) {
                onClose()
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
                                <FormControl>
                                    <FormLabel>Season Id</FormLabel>
                                    <Input {...register('season')} type="text" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Payment Amount</FormLabel>
                                    <Input {...register('amount')} type="text" />
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
                                <pre>{JSON.stringify(record.payments, null, '\t')}</pre>
                            </Code>
                        </AlertDialogBody>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    )
}

const ExpandedPaymentTable = ({ record }: { record: TeamPayment }): JSX.Element => {
    const seasonMap = [SeasonTwoSplit1].reduce((acc, elem) => {
        acc[elem.id] = elem.name
        for (const qual of elem.qualifiers) {
            acc[qual.id] = qual.name
        }
        return acc
    }, {})

    const columns: ColumnsType<IPayment> = [
        {
            title: 'Season',
            dataIndex: 'season',
            key: 'season',
            render: (season_name: string) => {
                if (season_name in seasonMap) {
                    return <>{seasonMap[season_name]}</>
                }
                return <>{season_name}</>
            },
        },
        {
            title: 'Payment Type',
            dataIndex: 'type',
            key: 'type',
            render: (payment_type: string) => {
                if (payment_type === 'paypal') {
                    return <FaPaypal />
                } else {
                    return <FaRegEnvelope />
                }
            },
        },
        {
            title: 'Payment Email',
            dataIndex: ['payment', 'payer', 'email_address'],
        },
        {
            title: 'Amount',
            dataIndex: ['payment', 'purchase_units'],
            key: 'amount',
            render: (purchase_units) => {
                console.log(purchase_units)
                const [{ amount }] = purchase_units
                return `$${amount.value} ${amount.currency_code}`
            },
        },
        {
            title: 'Status',
            dataIndex: ['payment', 'status'],
            key: 'status',
        },
    ]

    return <Table columns={columns} dataSource={record.payments} rowKey={(elem) => elem.payment.id} />
}

const PaymentTable = ({ payments }: { payments: TeamPayment[] }) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...createFilters<TeamPayment>(payments, 'name', { filterSearch: true }),
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
            <Table
                expandable={{
                    expandIcon: (props: RenderExpandIconProps<TeamPayment>) => {
                        if (props.record.payments.length > 0) {
                            if (props.expanded) {
                                return (
                                    <span onClick={(e) => props.onExpand(props.record, e)}>
                                        <FaMinusSquare className="cursor-pointer" />({props.record.payments.length})
                                    </span>
                                )
                            }
                            return (
                                <span onClick={(e) => props.onExpand(props.record, e)}>
                                    <FaPlusSquare className="cursor-pointer" />({props.record.payments.length})
                                </span>
                            )
                        }
                        return <></>
                    },
                    expandedRowRender: (team) => {
                        if (team.payments.length > 0) {
                            return <ExpandedPaymentTable record={team} />
                        }
                    },
                }}
                columns={columns}
                dataSource={payments}
                rowKey={(elem) => elem.id}
            />
        </div>
    )
}

interface IAdminSeason {
    qualifiers: Tournament[]
    payments: TeamPayment[]
}

const SeasonTable = (): JSX.Element => {
    const { push } = useRouter()
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Date',
            dataIndex: 'start_date',
            key: 'start_date',
        },
        {
            title: 'Reg Open',
            dataIndex: 'registration_opens',
            key: 'registration_opens',
            render: (val) => {
                return <>{dayjs(val).format('LLL')}</>
            },
        },
        {
            title: 'Reg Closed',
            dataIndex: 'registration_closes',
            key: 'registration_closes',
            render: (val) => {
                return <>{dayjs(val).format('LLL')}</>
            },
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
            <h2 className="page-title-sm">Seasons</h2>
            <Table rowKey={(record) => record.id} columns={columns} dataSource={[SeasonTwoSplit1]} />
        </div>
    )
}

const AdminSeason = ({ qualifiers, payments }: IAdminSeason) => {
    return (
        <div className="space-y-2">
            <QualifierTable qualifiers={qualifiers} />
            <SeasonTable />
            <PaymentTable payments={payments} />
        </div>
    )
}

AdminSeason.layout = (content: React.ReactNode): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}

export default AdminSeason
