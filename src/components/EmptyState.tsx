import React from 'react'


interface IEmptyState {
    icon: React.ReactNode;
    text: string;
    subtext?: string;
}

export default function EmptyState({ text, icon, subtext }: IEmptyState): JSX.Element {
    return (
        <div className='flex justify-center items-center h-64 flex-col text-alt'>
            <div className='text-6xl'>
                {icon}
            </div>
            <div className='font-semibold text-lg tracking-tight mt-4'>
                {text}
            </div>
            {subtext && (
                <div className='font-medium text-sm max-w-xs tracking-tight text-alt-2 text-center'>
                    {subtext}
                </div>
            )}
        </div>
    )
}
