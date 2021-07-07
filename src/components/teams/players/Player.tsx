import { useFormContext } from 'react-hook-form'
import React from 'react'
import { FormErrorMessage, HStack, Input, Radio, Tooltip, useRadioGroup, UseRadioProps } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import CountryRadio from '@components/teams/players/CountryRadio'
import { FaTimes } from 'react-icons/fa'
// import { TeamContext } from '@components/teams/teamContext'
import { PlayerFormItem } from '@components/teams/players/Form'

interface IPlayerProps {
    locked: boolean
    player: PlayerFormItem
    order: number
    captainRadioProps: UseRadioProps
}

function Player({ locked, player, order, captainRadioProps }: IPlayerProps): JSX.Element {
    // console.log('Re-Render Player?: ', player)
    const { register, formState, setValue } = useFormContext()

    // const teamContext = useContext(TeamContext)
    // const { user } = teamContext
    // const { loading: invitationsLoading, inviteUser, getInvitation } = useInvitations()
    const { errors } = formState
    const radioOptions = [
        {
            label: '🇨🇦',
            value: 'CA',
        },
        {
            label: '🇺🇸',
            value: 'USA',
        },
    ]

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const defaultCountry = player.country !== '' && player.country ? player.country : 'CA'
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'country',
        defaultValue: defaultCountry,
        onChange: (nextValue) => {
            if (!locked) {
                setValue(`players.${order}.country`, nextValue, {
                    shouldDirty: true,
                })
            }
        },
    })
    const group = getRootProps()

    // const renderInvite = (): JSX.Element => {
    //     if (features.invite) {
    //         const userEmail = getValues(`players.${order}.email`)
    //         if (!invitationsLoading && player.id) {
    //             if (user.email !== userEmail && !error()?.email && userEmail !== '' && userEmail) {
    //                 const invitation = getInvitation(userEmail)
    //                 if (!invitation) {
    //                     return (
    //                         <Button onClick={(e) => inviteUser(e, userEmail)} type="button" colorScheme="blue">
    //                             Invite&nbsp;
    //                             <FaEnvelope />
    //                         </Button>
    //                     )
    //                 } else {
    //                     return <>Sent Already</>
    //                 }
    //             }
    //         }
    //     }
    //     return <></>
    //
    //     // return true
    // }

    const error = () => {
        if ('players' in errors) {
            if (typeof errors.players[order] !== 'undefined') {
                return errors.players[order]
            }
        }
    }

    const clearPlayer = () => {
        console.log('CLEAR?')
        if (!locked) {
            setValue(`players.${order}.email`, '', {
                shouldDirty: true,
            })
            setValue(`players.${order}.uplay`, '', {
                shouldDirty: true,
            })
        }
    }

    return (
        <div className="flex flex-col mx bordered border rounded-xl w-full max-w-3xl mb-4 ml-4 py-1 px-2">
            <div className="flex items-center justify-between text-main font-medium pt-4 px-6 pr-6">
                <div>{player.required ? `Player ${order + 1}` : `Substitute ${order - 4} (Optional)`}</div>
                <div>
                    <input type="text" hidden defaultValue={player.id} {...register(`players.${order}.id`)} />
                    <Tooltip label="Clear Player" hasArrow={true}>
                        <span onClick={clearPlayer} className="cursor-pointer">
                            <FaTimes className="text-error hover:text-primary transition-colors duration-150" />{' '}
                        </span>
                    </Tooltip>
                </div>
            </div>
            <div className="flex flex-row px-3 py-2 pb-4">
                <div className="flex-grow w-full px-2 max-w-lg justify-between">
                    <FormControl isInvalid={!!error()?.email} isRequired={true} id={`email${order}`}>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                            isReadOnly={locked}
                            defaultValue={player.email}
                            {...register(`players.${order}.email`)}
                            placeholder="Email Address"
                            type="email"
                        />
                        <FormErrorMessage>{error()?.email?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl id={`uplay${order}`} isRequired={true} isInvalid={!!error()?.uplay}>
                        <FormLabel>Uplay</FormLabel>
                        <Input
                            defaultValue={player.uplay}
                            isReadOnly={locked}
                            {...register(`players.${order}.uplay`)}
                            placeholder="Uplay ID"
                            type="text"
                        />
                        <FormErrorMessage>{error()?.uplay?.message}</FormErrorMessage>
                    </FormControl>
                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                        <FormControl id={`twitter${order}`} isInvalid={!!error()?.twitter}>
                            <FormLabel>Twitter Account</FormLabel>
                            <Input
                                {...register(`players.${order}.twitter`)}
                                defaultValue={player.twitter}
                                type="text"
                                placeholder="Twitter Handle"
                                isReadOnly={locked}
                            />
                            <FormErrorMessage>{error()?.twitter?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl id={`twitch${order}`} isInvalid={!!error()?.twitch}>
                            <FormLabel>Twitch Account</FormLabel>
                            <Input
                                {...register(`players.${order}.twitch`)}
                                defaultValue={player.twitch}
                                type="text"
                                placeholder="Twitch Username"
                                isReadOnly={locked}
                            />
                            <FormErrorMessage>{error()?.twitch?.message}</FormErrorMessage>
                        </FormControl>
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-between pb-2 text-right px-6">
                    <FormControl>
                        <FormLabel>Country</FormLabel>
                        <input
                            id={`players.${order}.country`}
                            defaultValue={defaultCountry}
                            hidden
                            {...register(`players.${order}.country`)}
                        />
                        <HStack {...group}>
                            {radioOptions.map((radioValue) => {
                                const { value, label } = radioValue
                                const radio = getRadioProps({ value, disabled: locked })
                                return (
                                    <CountryRadio order={order} key={value} {...radio}>
                                        {label}
                                    </CountryRadio>
                                )
                            })}
                        </HStack>
                    </FormControl>
                    {player.required && (
                        <div className="text-main font-medium text-left flex h-10">
                            <Radio isDisabled={locked} className="ml-2 cursor-pointer" {...captainRadioProps}>
                                Team Captain
                            </Radio>
                            <input
                                type="checkbox"
                                defaultChecked={captainRadioProps.isChecked}
                                {...register(`players.${order}.is_captain`)}
                                hidden
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Player.whyDidYouRender = true

export default Player
