import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import React from 'react'
import AdminLayout from '@components/admin/layout'

export const getServerSideProps = withAuthSSR({
    whenNotAdmin: AuthAction.REDIRECT_TO_APP,
})(async () => {
    return {
        props: {},
    }
})

const Admin = () => {
    return <div>Admin Home</div>
}

Admin.layout = (content: React.ReactNode): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}
export default Admin
