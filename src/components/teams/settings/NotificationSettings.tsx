import React, { useContext } from 'react'
import { TeamContext } from '@components/teams/teamContext'
import { Button, Switch, useToast } from '@chakra-ui/react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { FaClipboard, FaCreditCard, FaTrophy } from 'react-icons/fa'

interface IToggleSetting {
    name: string
    icon: React.ReactNode
    title: string
    description: string
}

const ToggleSetting = ({ name, icon, title, description }: IToggleSetting) => {
    const { register } = useFormContext()
    return (
        <>
            <div className="flex flex-row w-full justify-between">
                <div className="flex flex-row py-4">
                    <span className="text-lg mx-3 mt-1">{icon}</span>
                    <div className="flex flex-col">
                        <div className="font-medium text-lg text-alt">{title}</div>
                        <div className="font-normal text-sm text-alt-2 max-w-md">{description}</div>
                    </div>
                </div>
                <div className="flex flex-col self-center">
                    <Switch {...register(name)} size="lg" colorScheme={'green'} />
                </div>
            </div>
            <hr className="mx-4" />
        </>
    )
}

const NotificationSettings = () => {
    const teamContext = useContext(TeamContext)
    const toast = useToast({ variant: 'solid', position: 'top-right' })
    const { team } = teamContext

    const getDefaultValue = (val) => {
        if (val !== undefined) {
            return val
        }
        return true
    }

    const initialValues = {
        registration: getDefaultValue(team.notification_settings?.registration),
        payment: getDefaultValue(team.notification_settings?.payment),
        qualification: getDefaultValue(team.notification_settings?.qualification),
    }

    const methods = useForm({
        defaultValues: {
            ...initialValues,
        },
    })

    const {
        handleSubmit,
        formState: { isDirty, isSubmitting },
    } = methods

    const onSubmit = (values) => {
        fetch('/api/team/preferences/update', {
            method: 'POST',
            body: JSON.stringify({ team_id: team.id, settings: values }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => {
            if (result.ok) {
                toast({
                    title: 'Updated Notification Preferences',
                    status: 'success',
                    duration: 2000,
                })
            }
        })
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className="flex flex-row justify-between">
                        <div>
                            <div className="text-subtitle">Notification Settings</div>
                            <div className="text-subtitle-description">
                                The types of emails you would like to receive
                            </div>
                        </div>
                        <div className="flex flex-col self-center">
                            <Button size="md" colorScheme="blue" isLoading={isSubmitting} isDisabled={!isDirty}>
                                Update Preferences
                            </Button>
                        </div>
                    </div>
                    <div className="p-2 py-4">
                        <ToggleSetting
                            name={'registration'}
                            icon={<FaClipboard />}
                            title={'Registration Emails'}
                            description={
                                'Receive emails confirming your registration to an event, including the events time and link'
                            }
                        />
                        <ToggleSetting
                            name={'payment'}
                            icon={<FaCreditCard />}
                            title={'Payment Emails'}
                            description={'Receive emails confirming your success payment for a Quals Pass '}
                        />
                        <ToggleSetting
                            name={'qualification'}
                            icon={<FaTrophy />}
                            title={'Qualification Emails'}
                            description={'Receive emails regarding the status of your qualification '}
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}

export default NotificationSettings
