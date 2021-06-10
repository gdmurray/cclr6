import { Spinner } from '@chakra-ui/react'
import React from 'react'

interface ILoader {
    text?: string
}

export default function Loader({ text }: ILoader): JSX.Element {
    return (
        <div className="flex justify-center items-center h-64 flex-col">
            <Spinner label="Loading Positions" />
            {text && <div className="font-semibold text-sm tracking-tight mt-4">{text}</div>}
        </div>
    )
}
