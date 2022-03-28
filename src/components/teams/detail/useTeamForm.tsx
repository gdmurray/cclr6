import * as yup from 'yup'
import { useForm, ValidationMode } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { ITeam, uploadLogoToStorage } from '@lib/models/team'

const schema = yup.object().shape({
    name: yup
        .string()
        .min(3, 'Name must be at least 3 characters')
        .max(32, 'Name cannot be longer than 32 characters')
        .required('Team Name is Required'),
    twitter: yup.string().max(15, 'Twitter handle cannot be longer than 15 characters').notRequired(),
    contact_email: yup.string().email().notRequired(),
    logo: yup.string().nullable(),
    slug: yup.string().nullable().notRequired(),
    update_toornament: yup.boolean().default(true),
})

interface TeamInformationForm {
    name: string
    contact_email?: string
    twitter?: string
    logo: string
    slug?: string
    update_toornament?: boolean
}

interface UseTeamFormProps {
    uploadRef: React.RefObject<HTMLInputElement>
    team?: ITeam
}

export function useTeamForm({ uploadRef, team }: UseTeamFormProps) {
    const defaultFormProps = {
        mode: 'onBlur' as keyof ValidationMode,
        resolver: yupResolver(schema),
    }
    const formProps = team
        ? {
              ...defaultFormProps,
              defaultValues: {
                  name: team.name,
                  logo: team.logo,
                  twitter: team.twitter,
                  contact_email: team.contact_email,
                  slug: undefined,
              },
          }
        : defaultFormProps

    const methods = useForm<TeamInformationForm>({
        ...formProps,
    })

    const { trigger, setValue, setError } = methods

    const handleLogoClick = (): void => {
        if (uploadRef.current) {
            uploadRef.current.click()
        }
    }

    const validateLogo = async (logo: File): Promise<boolean> => {
        return new Promise((resolve) => {
            const sizeInMb = logo.size / 1024 / 1024
            if (sizeInMb > 4) {
                setError('logo', {
                    type: 'manual',
                    message: 'Logo cannot be larger than 4mb!',
                })
                return resolve(false)
            }
            const reader = new FileReader()
            reader.readAsDataURL(logo)
            reader.onload = function (e) {
                const image = new Image()
                image.src = e.target.result as string
                image.onload = function () {
                    const height = image.naturalHeight || image.width
                    const width = image.naturalWidth || image.width
                    if (height < 200 && width < 200) {
                        setError('logo', {
                            type: 'manual',
                            message: 'Image must be at least 200x200px',
                        })
                        return resolve(false)
                    }
                    if (height / width > 1.01 || height / width < 0.99) {
                        setError('logo', {
                            type: 'manual',
                            message: 'Logo must be square',
                        })
                        return resolve(false)
                    }
                    return resolve(true)
                }
            }
        })
    }

    const handleFileInput = (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        if (file) {
            validateLogo(file).then((isValid) => {
                if (isValid) {
                    uploadLogoToStorage(file, (url) => {
                        setValue('logo', url, {
                            shouldDirty: true,
                            shouldValidate: true,
                        })
                        trigger('logo')
                    })
                }
            })
        }
    }

    const handleLogoClear = () => {
        setValue('logo', null, {
            shouldDirty: true,
        })
        trigger('logo')
    }

    return {
        methods,
        handleLogoClick,
        handleFileInput,
        handleLogoClear,
    }
}
