import { useEffect } from 'react'


export const Mail = (): JSX.Element => {
    useEffect(() => {
        fetch("/api/mail")
    }, [])
    return (
        <div>
            mail moment
        </div>
    )
}

export default Mail