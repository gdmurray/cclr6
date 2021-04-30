import React from 'react'


interface IEmptyState {
    icon: React.ReactNode;
    text: string;
}

export default function EmptyState({ text, icon }: IEmptyState): JSX.Element {
    return (
        <div className='flex justify-center items-center h-64 flex-col text-alt'>
            <div className="text-6xl">
                {icon}
            </div>
            <div className='font-semibold text-sm tracking-tight mt-4'>
                {text}
            </div>
        </div>
    )
}
