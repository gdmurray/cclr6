import { useEffect } from 'react'


export const Mail = (): JSX.Element => {
    useEffect(() => {
        fetch('/api/mail').then(res => {
            res.json().then(response => {
                console.log('RESPONSE: ', response)
            })
        })
    }, [])
    return (
        <div>
            mail moment
        </div>
    )
}

export default Mail