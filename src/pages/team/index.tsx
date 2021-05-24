import React, { useContext, useRef } from 'react'
import TeamLayout from '@components/teams/layout'
import { TeamContext } from '@components/teams/teamContext'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { Button, FormErrorMessage, Image, Input, Tooltip, useToast } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { FaQuestionCircle, FaTimes } from 'react-icons/fa'
import { Teams } from '@lib/models/team'
import { useTeamForm } from '@components/teams/useTeamForm'


const url = '/team'
export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
    referral: url
})({})

function Team(): JSX.Element {
    const teamContext = useContext(TeamContext)
    const { team, user, setTeam } = teamContext
    const toast = useToast({ position: 'top-right', duration: 2000 })

    const uploadRef = useRef<HTMLInputElement>()
    const { methods, handleLogoClick, handleLogoClear, handleFileInput } = useTeamForm({ uploadRef, team })

    const { getValues, handleSubmit, register, formState: { isDirty, errors } } = methods

    const canEdit = (): boolean => {
        return team.role === 'Owner'
    }

    const onSubmit = (values) => {
        if (canEdit()) {
            Teams.updateTeam(team.id, values).then((result) => {
                setTeam({
                    ...team,
                    ...values
                })
                toast({
                    title: `Team Updated`,
                    status: 'success'
                })
            })
        }

    }


    // console.log(getValues())
    const { logo } = getValues()
    console.log('LOGO: ', logo)
    if (team) {
        return (
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-row'>
                        <div>
                            <FormControl id='logo' defaultValue={team.logo} isInvalid={!!errors?.logo?.message}>
                                {canEdit() && logo && (<span style={{
                                    marginLeft: '-15px'
                                }} onClick={handleLogoClear}
                                                                         className='hover:text-primary float-right cursor-pointer text-main transition-colors duration-150'><FaTimes /></span>)}
                                <Image
                                    className='cursor-pointer mx-auto'
                                    onClick={canEdit() ? handleLogoClick : undefined}
                                    defaultValue={team.logo}
                                    ignoreFallback={logo !== null}
                                    src={logo}
                                    borderRadius='full'
                                    fallbackSrc='https://via.placeholder.com/150?text=Logo'
                                    width={100} />
                                {!logo && (
                                    <div
                                        className='pt-3 text-alt-2 text-main font-normal text-sm text-center whitespace-nowrap flex flex-row items-center'>
                                        Upload Logo
                                        <Tooltip label='Square, min 200x200 px, PNG or JPG' hasArrow placement='top'>
                                            <span className='ml-1'><FaQuestionCircle /></span>
                                        </Tooltip>
                                    </div>
                                )}
                                <FormErrorMessage>{errors?.logo?.message}</FormErrorMessage>
                                <input accept='.png, .jpg, .jpeg' ref={uploadRef} onChange={handleFileInput}
                                       name='logo-file' type='file' hidden />
                                <input id='logo' name='logo' {...register('logo')} hidden />
                            </FormControl>

                        </div>
                        <div className='ml-8'>
                            <FormControl id='name' isRequired={true} isInvalid={!!errors?.name?.message}>
                                <FormLabel>Team Name</FormLabel>
                                <Input
                                    readOnly={!canEdit()}
                                    {...register('name')}
                                    defaultValue={team.name}
                                    width={300}
                                    size='lg'
                                    px={5}
                                    py={5} variant='flushed'
                                    placeholder={'Team Name'} />
                                <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                            </FormControl>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        {isDirty && canEdit() && (
                            <Button type='submit' colorScheme='teal'>Update</Button>
                        )}
                    </div>
                    <style jsx>{`
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
            </div>
        )
    }
}

Team.SEO = {
    title: 'Team Page',
    url
}

Team.layout = (content: React.ReactNode): JSX.Element => {
    return <TeamLayout>{content}</TeamLayout>
}
export default Team