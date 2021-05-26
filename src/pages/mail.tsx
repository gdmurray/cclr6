import Email from 'email-templates'
import * as path from 'path'
import { defaultLocals, getEmail, transporter } from '@lib/platform/mail'

export function getServerSideProps() {
    // const email = getEmail()
    // email.send({
    //     template: path.resolve('src/email/invite'),
    //     message: {
    //         to: 'gd-murray@hotmail.com'
    //     },
    //     locals: {
    //         ...defaultLocals,
    //         team_name: 'Mkers',
    //         cta_url: 'http://localhost:3001/invite?bruh=moment'
    //     }
    // })
    return {
        props: {}
    }
}

export default function Mail(): JSX.Element {
    return (
        <div>Mail</div>
    )
}