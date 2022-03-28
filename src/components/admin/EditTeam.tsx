import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { FaQuestionCircle, FaTimes } from 'react-icons/fa'
import { Button, Checkbox, FormErrorMessage, Image, Input, Tooltip, useToast } from '@chakra-ui/react'
import React, { useRef } from 'react'
import { useTeamForm } from '@components/teams/detail/useTeamForm'
import { ITeam } from '@lib/models/team'

const AdminEditTeam = ({ team }: { team: ITeam }) => {
    const toast = useToast({ position: 'top-right', duration: 2000 })

    const uploadRef = useRef<HTMLInputElement>()
    const { methods, handleLogoClick, handleLogoClear, handleFileInput } = useTeamForm({ uploadRef, team })
    const {
        getValues,
        handleSubmit,
        register,
        formState: { isDirty, errors },
    } = methods

    const onSubmit = (values) => {
        console.log(values)
        const { update_toornament, ...formValues } = values
        fetch('/api/admin/team/update', {
            method: 'POST',
            body: JSON.stringify({
                team_id: team.id,
                update_toornament,
                values: formValues,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            if (res.ok) {
                toast({
                    title: 'Information Updated',
                })
            }
        })
    }

    const { logo } = getValues()

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row">
                <div>
                    <FormControl id="logo" defaultValue={team.logo} isInvalid={!!errors?.logo?.message}>
                        {logo && (
                            <span
                                style={{
                                    marginLeft: '-15px',
                                }}
                                onClick={handleLogoClear}
                                className="hover:text-primary float-right cursor-pointer text-main transition-colors duration-150"
                            >
                                <FaTimes />
                            </span>
                        )}
                        <Image
                            className="cursor-pointer mx-auto"
                            onClick={handleLogoClick}
                            defaultValue={team.logo}
                            ignoreFallback={logo !== null}
                            src={logo}
                            borderRadius="full"
                            fallbackSrc="https://via.placeholder.com/150?text=Logo"
                            width={100}
                        />
                        {!logo && (
                            <div className="pt-3 text-alt-2 text-main font-normal text-sm text-center whitespace-nowrap flex flex-row items-center">
                                Upload Logo
                                <Tooltip label="Square, min 200x200 px, PNG or JPG" hasArrow placement="top">
                                    <span className="ml-1">
                                        <FaQuestionCircle />
                                    </span>
                                </Tooltip>
                            </div>
                        )}
                        <FormErrorMessage>{errors?.logo?.message}</FormErrorMessage>
                        <input
                            accept=".png, .jpg, .jpeg"
                            ref={uploadRef}
                            onChange={handleFileInput}
                            name="logo-file"
                            type="file"
                            hidden
                        />
                        <input id="logo" name="logo" {...register('logo')} hidden />
                    </FormControl>
                </div>
                <div className="ml-8">
                    <FormControl id="name" isRequired={true} isInvalid={!!errors?.name?.message}>
                        <FormLabel>Team Name</FormLabel>
                        <Input
                            {...register('name')}
                            defaultValue={team.name}
                            width={300}
                            size="lg"
                            px={5}
                            py={5}
                            variant="flushed"
                            placeholder={'Team Name'}
                        />
                        <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl id="contact_email" isRequired={true} isInvalid={!!errors?.contact_email?.message}>
                        <FormLabel>Contact Email</FormLabel>
                        <Input
                            {...register('contact_email')}
                            defaultValue={team.contact_email}
                            width={300}
                            size="lg"
                            px={5}
                            py={5}
                            variant="flushed"
                            placeholder={'Team Contact Email'}
                        />
                        <FormErrorMessage>{errors?.contact_email?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl id="twitter" isRequired={false} isInvalid={!!errors?.twitter?.message}>
                        <FormLabel>Team Twitter</FormLabel>
                        <Input
                            {...register('twitter')}
                            defaultValue={team.twitter}
                            width={300}
                            size="lg"
                            px={5}
                            py={5}
                            variant="flushed"
                            placeholder={'Team Twitter Acount'}
                        />
                        <FormErrorMessage>{errors?.twitter?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl id="slug" isRequired={false}>
                        <FormLabel>Team Slug</FormLabel>
                        <Input
                            {...register('slug')}
                            defaultValue={team.slug}
                            width={300}
                            size="lg"
                            px={5}
                            py={5}
                            variant="flushed"
                            placeholder={'Slug'}
                        />
                    </FormControl>
                    <FormControl id={'update_toornament'} isRequired={false} display={'flex'}>
                        <FormLabel>Update Toornament</FormLabel>
                        <Checkbox {...register('update_toornament')} defaultIsChecked={false} size={'lg'} />
                    </FormControl>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                {isDirty && (
                    <Button type="submit" colorScheme="teal">
                        Update
                    </Button>
                )}
            </div>
            <style jsx>
                {`
                    .chakra-input,
                    input {
                        background: transparent !important;
                    }

                    input:-webkit-autofill,
                    input:-webkit-autofill:hover,
                    input:-webkit-autofill:focus,
                    input:-webkit-autofill:active {
                        -webkit-animation: autofill 0s forwards;
                        animation: autofill 0s forwards;
                    }

                    @keyframes autofill {
                        100% {
                            background: transparent;
                            color: inherit;
                        }
                    }

                    @-webkit-keyframes autofill {
                        100% {
                            background: transparent;
                            color: inherit;
                        }
                    }
                `}
            </style>
        </form>
    )
}

export default AdminEditTeam
