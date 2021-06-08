import { Box, useColorMode, useRadio, UseRadioProps } from '@chakra-ui/react'
import React from 'react'

interface ICountryRadio extends UseRadioProps {
    order: number
    children: string
}

export default function CountryRadio(props: ICountryRadio) {
    const { getInputProps, getCheckboxProps } = useRadio(props)
    const input = getInputProps()
    const checkbox = getCheckboxProps()
    const { colorMode } = useColorMode()
    return (
        <Box as={'label'}>
            <input {...input} />
            <Box
                {...checkbox}
                className="dark:hover:bg-gray-800"
                cursor="pointer"
                borderWidth="2px"
                borderRadius="md"
                boxShadow="sm"
                _checked={{
                    borderWidth: '2px',
                    borderColor: '#e50a25',
                    background: colorMode === 'light' ? '#FEE2E2' : '#57534E',
                }}
                _focus={{
                    boxShadow: 'outline',
                }}
                p={1}
                py={0}
            >
                <span className="text-3xl">{props.children}</span>
            </Box>
        </Box>
    )
}
