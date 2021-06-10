import AdminLayout from '@components/admin/layout'
import React from 'react'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { Button, useToast } from '@chakra-ui/react'

export const getServerSideProps = withAuthSSR({
    whenNotAdmin: AuthAction.REDIRECT_TO_APP,
})({})

interface EmailTemplate {
    name: string
    template: string
    variables: string[]
}

const Test = (): JSX.Element => {
    const toast = useToast({ variant: 'solid', position: 'top-right' })
    const defaultVariables = {
        cta_url: 'https://cclr6.com',
        event_name: 'Test Qualifier #1',
        team_name: 'Test Team CCL',
        user_email: 'transfer@cclr6.com',
    }
    const emails = [
        {
            name: 'Verify',
            template: 'verify',
            variables: ['cta_url'],
        },
        {
            name: 'Forgot Password',
            template: 'forgot_password',
            variables: ['cta_url'],
        },
        {
            name: 'Invite',
            template: 'invite',
            variables: ['team_name', 'cta_url'],
        },
        {
            name: 'Payment Success',
            template: 'payment_success',
            variables: ['event_name', 'cta_url'],
        },
        {
            name: 'Transfer Team',
            template: 'transfer_team',
            variables: ['team_name', 'cta_url'],
        },
        {
            name: 'Registration',
            template: 'registration',
            variables: ['event_name', 'cta_url'],
        },
        {
            name: 'Transfer success',
            template: 'transfer_success',
            variables: ['team_name', 'user_email'],
        },
    ]

    const handleEmailSend = (template: EmailTemplate): void => {
        toast({ status: 'info', title: `Sending ${template.name}`, duration: 1000 })
        const templateName = template.template.toString()
        const variables = template.variables.reduce((acc, variable) => {
            acc[variable] = defaultVariables[variable].toString()
            return acc
        }, {})

        const vars = JSON.stringify({
            template: templateName,
            variables,
        })
        fetch('/api/admin/email', {
            method: 'POST',
            body: vars,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                console.log(response)
            }
        })
    }

    return (
        <div className="max-w-4xl space-y-4">
            {emails.map((email) => {
                return (
                    <>
                        <div key={email.template} className="flex flex-row justify-between">
                            <div>
                                <div className="text-subtitle">{email.name}</div>
                                <div className="text-sm font-medium text-alt-2">{email.variables.join(', ')}</div>
                            </div>

                            <div>
                                <Button onClick={() => handleEmailSend(email)}>Send Email</Button>
                            </div>
                        </div>
                        <hr />
                    </>
                )
            })}
        </div>
    )
}

Test.layout = (content: React.ReactNode[]): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}

export default Test
