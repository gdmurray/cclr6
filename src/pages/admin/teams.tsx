import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import AdminLayout from '@components/admin/layout'
import React, { useState } from 'react'
import { adminFireStore } from '@lib/firebase/admin'
import Table from 'rc-table'
import { Image, Table as CTable, Thead, Tbody, Tfoot, Tr, Th, Td, useTheme } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { FaCheck, FaChevronCircleRight, FaMinusSquare, FaPlusSquare } from 'react-icons/fa'
import { AlignType } from 'rc-table/lib/interface'
import { useRouter } from 'next/router'

export const getServerSideProps = withAuthSSR({
    whenNotAdmin: AuthAction.REDIRECT_TO_APP
})(async (context) => {
    let teams = await adminFireStore
        .collection('teams')
        .get()

    const getFullTeamData = async (team): Promise<any> => {
        const players = await adminFireStore
            .collection('teams')
            .doc(team.id)
            .collection('players')
            .get()
        return Promise.resolve({
            id: team.id,
            ...team.data(),
            players: players.docs.map((player) => ({ id: player.id, ...player.data() }))
        })
    }
    const data = await Promise.all(teams.docs.map((team) => getFullTeamData(team)))
    return {
        props: {
            data
        }
    }
})

// const StyledTable = styled(Table)`
//   th {
//     font-family: var(--chakra-fonts-heading);
//     font-weight: var(--chakra-fontWeights-bold);
//     text-transform: uppercase;
//     letter-spacing: var(--chakra-letterSpacings-wider);
//     text-align: start;
//     -webkit-padding-start: var(--chakra-space-6);
//     padding-inline-start: var(--chakra-space-6);
//     -webkit-padding-end: var(--chakra-space-6);
//     padding-inline-end: var(--chakra-space-6);
//     padding-top: var(--chakra-space-3);
//     padding-bottom: var(--chakra-space-3);
//     line-height: var(--chakra-lineHeights-4);
//     font-size: var(--chakra-fontSizes-xs);
//     color: var(--chakra-colors-gray-400);
//     border-bottom: var(--chakra-borders-1px);
//     border-color: var(--chakra-colors-gray-700);
//   }
// `

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]
        var y = b[key]
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
    })
}


const expandedRowRender = (team) => {
    const columns = [
        {
            title: 'Captain',
            dataIndex: 'is_captain',
            key: 'is_captain',
            width: 50,
            align: 'center' as AlignType,
            render: (isCaptain) => {
                if (isCaptain) {
                    return <FaCheck className='text-success' />
                }
                return <></>
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Uplay',
            dataIndex: 'uplay',
            key: 'uplay'
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            render: (country) => {
                if (country === 'CA') {
                    return <>🇨🇦</>
                } else {
                    return <>🇺🇸</>
                }
            }
        }
    ]
    return <Table
        columns={columns}
        rowKey={(record) => record.id}
        data={team.players ? sortByKey(team.players, 'order') : []} />
}

const AdminTeams = ({ data }) => {
    const { push } = useRouter()
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([])
    const columns = [
        {
            title: 'Logo',
            field: 'logo',
            width: 60,
            render: (rowData) => {
                if (rowData.logo) {
                    return <div style={{ width: '60px' }}><Image src={rowData.logo} alt={'logo'} width={50} /></div>
                }
                return <></>
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Contact',
            dataIndex: 'contact_email',
            key: 'contact_email'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (rowData) => {
                return (
                    <FaChevronCircleRight className='cursor-pointer'
                                          onClick={() => push(`/admin/teams/${rowData.id}`)} />
                )
            }
        }
    ]

    const handleExpandClick = (key) => {
        if (expandedRowKeys.indexOf(key) === -1) {
            expandedRowKeys.push(key)
            setExpandedRowKeys([...expandedRowKeys])
        } else {
            const filtered = expandedRowKeys.filter((elem) => elem !== key)
            setExpandedRowKeys(filtered)
        }
    }

    return (
        <div>
            <Table
                className='data-table'
                columns={columns}
                data={data}
                rowKey={(record) => record.id}
                expandable={{
                    expandedRowKeys: expandedRowKeys,
                    expandIcon: (props) => {
                        if (props.expanded) {
                            return <FaMinusSquare className='cursor-pointer'
                                                  onClick={() => handleExpandClick(props.record.id)} />
                        }
                        return (<FaPlusSquare className='cursor-pointer'
                                              onClick={() => handleExpandClick(props.record.id)} />)
                    },
                    expandedRowRender: (team) => {
                        return <div className='nested'>{expandedRowRender(team)}</div>
                    }
                }}
            />

        </div>
    )
}

AdminTeams.layout = (content: React.ReactNode): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}

export default AdminTeams


// import { mode } from "@chakra-ui/theme-tools";
// var styles = {
//     global: props => ({
//         body: {
//             fontFamily: "body",
//             color: mode("gray.800", "whiteAlpha.900")(props),
//             bg: mode("white", "gray.800")(props),
//             transition: "background-color 0.2s",
//             lineHeight: "base"
//         },
//         "*::placeholder": {
//             color: mode("gray.400", "whiteAlpha.400")(props)
//         },
//         "*, *::before, &::after": {
//             borderColor: mode("gray.200", "whiteAlpha.300")(props),
//             wordWrap: "break-word"
//         }
//     })
// };
// export default styles;

// <CTable variant='simple'>
//     <Thead>
//     <Tr>
//     <Th>To convert</Th>
// <Th>into</Th>
// <Th isNumeric>multiply by</Th>
// </Tr>
// </Thead>
// <Tbody>
// <Tr>
// <Td>inches</Td>
// <Td>millimetres (mm)</Td>
// <Td isNumeric>25.4</Td>
// </Tr>
// <Tr>
// <Td>feet</Td>
// <Td>centimetres (cm)</Td>
// <Td isNumeric>30.48</Td>
// </Tr>
// <Tr>
// <Td>yards</Td>
// <Td>metres (m)</Td>
// <Td isNumeric>0.91444</Td>
// </Tr>
// </Tbody>
// <Tfoot>
// <Tr>
// <Th>To convert</Th>
// <Th>into</Th>
// <Th isNumeric>multiply by</Th>
// </Tr>
// </Tfoot>
// </CTable>