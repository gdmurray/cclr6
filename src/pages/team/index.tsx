import React, { useContext } from 'react'
import TeamLayout from '@components/teams/layout'
import { TeamContext } from '@components/teams/teamContext'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { Image, Input } from '@chakra-ui/react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { FaTimes } from 'react-icons/fa'

const url = '/team'
export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
    referral: url
})({})

const schema = yup.object().shape({
    name: yup.string().min(3).max(32, 'Name cannot be longer than 32 characters').required('Team Name is Required'),
    logo: yup.string()
})

interface TeamInformationForm {
    name: string;
}

function Team(): JSX.Element {
    const teamContext = useContext(TeamContext)
    const { team, user } = teamContext

    const { register, handleSubmit, setValue } = useForm()
    console.log(team, user)
    const onSubmit = (values) => {
        console.log(onSubmit)
    }

    const handleLogoClear = () => {
        console.log('Cleared logo')
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-row'>
                    <div>
                        <FormControl id='logo' defaultValue={team.logo}>
                            <span style={{
                                marginLeft: '-15px'
                            }} onClick={handleLogoClear}
                                  className='hover:text-primary float-right cursor-pointer text-main transition-colors duration-150'><FaTimes /></span>
                            <Image
                                src={team.logo}
                                borderRadius='full'
                                fallbackSrc='https://via.placeholder.com/150?text=Logo'
                                width={100} />
                        </FormControl>

                    </div>
                    <div className='ml-8'>
                        <FormControl id='name' isRequired={true}>
                            <FormLabel>Team Name</FormLabel>
                            <Input width={300} size='lg' px={5} py={5} variant='flushed'
                                   placeholder={'Team Name'} />
                        </FormControl>
                    </div>
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

Team.SEO = {
    title: 'Team Page',
    url
}

Team.layout = (content: React.ReactNode): JSX.Element => {
    return <TeamLayout>{content}</TeamLayout>
}
export default Team