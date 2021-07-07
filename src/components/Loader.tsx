import { Spinner } from '@chakra-ui/react'
import React from 'react'

interface ILoader {
    text?: string
    height?: number
}

export default function Loader({ text, height }: ILoader): JSX.Element {
    return (
        <div className={`flex justify-center items-center flex-col ${height ? 'h-' + height : 'h-64'}`}>
            <Spinner label="Loading Positions" />
            {text && <div className="font-semibold text-sm tracking-tight mt-4">{text}</div>}
        </div>
    )
}
