import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { adminFireStore } from '@lib/firebase/admin'
import React from 'react'
import AdminLayout from '@components/admin/layout'


export const getServerSideProps = withAuthSSR({
    whenNotAdmin: AuthAction.REDIRECT_TO_APP
})(async (ctx) => {
    console.log('Youre an admin, love to see it')
    return {
        props: {}
    }
})

const Admin = () => {
    return (
        <div>
            Admin Home
        </div>
    )
}

Admin.layout = (content: React.ReactNode): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}
export default Admin