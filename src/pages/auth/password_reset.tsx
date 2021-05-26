import LoginForm from '@components/auth/loginForm'
import React from 'react'
import { useRouter } from 'next/router'
import ResetPasswordForm from '@components/auth/resetPasswordForm'

const PasswordReset = (): JSX.Element => {
    return (
        <div className='page-content'>
            <div
                className='px-12 py-8 sm:px-20 md:px-24 flex flex-col justify-center w-full mx-auto max-w-xl border rounded-md bordered'>
                <div
                    className='w-full text-center mb-4 font-bold text-2xl dark:text-gray-50 text-gray-900 mb-6'>
                    Reset Your Password
                </div>
                <ResetPasswordForm />
            </div>
        </div>
    )
}

export default PasswordReset