import { CreateTeamClient, ITeam } from '@lib/models/team'
import { Step, Steps } from 'chakra-ui-steps'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export function RegistrationSteps({ team }: { team: ITeam }): JSX.Element {
    const router = useRouter()
    const [playersLoading, setPlayersLoading] = useState<boolean>(true)
    const [purchaseLoading, setPurchaseLoading] = useState<boolean>(true)
    const [registerLoading, setRegisterLoading] = useState<boolean>(true)

    const [playerStep, setPlayerStep] = useState({
        label: 'Add Players',
        isCompletedStep: false,
        path: '/team/players',
    })

    const [purchaseStep, setPurchaseStep] = useState({
        label: 'Purchase Qualifier',
        isCompletedStep: false,
        path: '/team/registration',
    })

    const [registerStep, setRegisterStep] = useState({
        label: 'Register for Qualifier',
        isCompletedStep: false,
        path: '/team/registration',
    })

    const getValues = () => {
        teamClient.hasMinimumPlayers().then((result) => {
            if (result == true) {
                setPlayerStep({ label: 'Players Added', isCompletedStep: true, path: '/team/players' })
            }
            setPlayersLoading(false)
        })

        teamClient.getPaymentsStartingWith('s2p1').then((result) => {
            if (result.length > 0) {
                setPurchaseStep({
                    label: 'Qualifier Purchased',
                    isCompletedStep: true,
                    path: '/team/payments',
                })
            }
            setPurchaseLoading(false)
        })

        teamClient.getRegistrations().then((registrations) => {
            if (registrations.filter((reg) => reg.tournament_id.startsWith('s2p1')).length > 0) {
                setRegisterStep({
                    label: 'Registered for Qualifier',
                    isCompletedStep: true,
                    path: '/team/registration',
                })
            }
            setRegisterLoading(false)
        })
    }

    useEffect(() => {
        if (team != null) {
            getValues()
        }
    }, [team])
    const teamClient = CreateTeamClient(team)

    if (team == null) {
        return <></>
    }

    const steps = [
        {
            ...playerStep,
        },
        {
            ...purchaseStep,
        },
        {
            ...registerStep,
        },
    ]

    const loading = playersLoading || purchaseLoading || registerLoading
    if (!loading) {
        return (
            <div className="flex w-full my-4">
                <Steps
                    activeStep={steps.map((elem) => elem.isCompletedStep).indexOf(false)}
                    onClickStep={(step) => {
                        router.push(steps[step].path)
                    }}
                >
                    {steps.map((step) => (
                        <Step key={step.label} label={step.label} isCompletedStep={step.isCompletedStep} />
                    ))}
                </Steps>
            </div>
        )
    }
    return <></>
}
